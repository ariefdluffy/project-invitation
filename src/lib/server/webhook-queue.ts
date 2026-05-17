/**
 * Webhook delivery / retry queue.
 *
 * Used to queue outbound webhook deliveries (or to re-process failed inbound
 * webhooks like Midtrans notifications) that we want to retry with backoff.
 *
 * Inbound retries: when handling a Midtrans notification, if a downstream
 * write fails (DB error, partial state), we enqueue the raw payload so a
 * background worker can retry idempotently.
 *
 * Outbound deliveries: future feature for delivering webhooks to user-configured
 * URLs (e.g. RSVP notifications).
 */

import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';
import { createLogger } from './logger';

const log = createLogger('WebhookQueue');

export type WebhookDirection = 'inbound' | 'outbound';
export type WebhookStatus = 'pending' | 'success' | 'failed' | 'dead';

export interface WebhookJob {
	id: string;
	direction: WebhookDirection;
	source: string;
	target_url: string | null;
	payload: string;
	headers: string | null;
	status: WebhookStatus;
	attempts: number;
	max_attempts: number;
	next_retry_at: string | null;
	last_error: string | null;
	created_at: string;
	updated_at: string;
}

export async function ensureWebhookQueueTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS webhook_queue (
				id VARCHAR(36) PRIMARY KEY,
				direction ENUM('inbound', 'outbound') NOT NULL,
				source VARCHAR(50) NOT NULL,
				target_url VARCHAR(500) NULL,
				payload MEDIUMTEXT NOT NULL,
				headers TEXT NULL,
				status ENUM('pending', 'success', 'failed', 'dead') NOT NULL DEFAULT 'pending',
				attempts INT NOT NULL DEFAULT 0,
				max_attempts INT NOT NULL DEFAULT 5,
				next_retry_at TIMESTAMP NULL,
				last_error TEXT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				INDEX idx_status_next (status, next_retry_at),
				INDEX idx_source (source)
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) {
			log.error('Failed to ensure webhook_queue table', { error: err.message });
			throw err;
		}
	}
}

const RETRY_BACKOFF_SECONDS = [30, 60, 300, 900, 3600]; // 30s, 1m, 5m, 15m, 1h

export async function enqueueWebhook(params: {
	direction: WebhookDirection;
	source: string;
	payload: unknown;
	targetUrl?: string;
	headers?: Record<string, string>;
	maxAttempts?: number;
	delaySeconds?: number;
}): Promise<string> {
	const db = await getDb();
	const id = uuidv4();
	const nextRetryAt = new Date(Date.now() + (params.delaySeconds ?? 0) * 1000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');

	await db.execute(
		`INSERT INTO webhook_queue
		   (id, direction, source, target_url, payload, headers, status, attempts, max_attempts, next_retry_at)
		 VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)`,
		[
			id,
			params.direction,
			params.source,
			params.targetUrl || null,
			JSON.stringify(params.payload),
			params.headers ? JSON.stringify(params.headers) : null,
			params.maxAttempts ?? 5,
			nextRetryAt
		]
	);

	log.info('Enqueued', {
		id,
		direction: params.direction,
		source: params.source,
		nextRetryAt
	});

	return id;
}

/**
 * Fetch up to `limit` jobs that are ready to run.
 */
export async function claimDueJobs(limit: number = 10): Promise<WebhookJob[]> {
	const db = await getDb();
	const safeLimit = Math.max(1, Math.min(limit, 100));
	const [rows] = await db.query(
		`SELECT * FROM webhook_queue
		 WHERE status = 'pending'
		   AND (next_retry_at IS NULL OR next_retry_at <= NOW())
		 ORDER BY next_retry_at ASC
		 LIMIT ${safeLimit}`
	);
	return rows as WebhookJob[];
}

export async function markJobSuccess(id: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		"UPDATE webhook_queue SET status = 'success', last_error = NULL WHERE id = ?",
		[id]
	);
}

export async function markJobFailed(id: string, error: string, attempts: number, maxAttempts: number): Promise<void> {
	const db = await getDb();
	if (attempts >= maxAttempts) {
		await db.execute(
			"UPDATE webhook_queue SET status = 'dead', attempts = ?, last_error = ? WHERE id = ?",
			[attempts, error.slice(0, 1000), id]
		);
		log.error('Job dead-lettered', { id, attempts });
		return;
	}
	const idx = Math.min(attempts, RETRY_BACKOFF_SECONDS.length - 1);
	const delay = RETRY_BACKOFF_SECONDS[idx];
	const nextRetry = new Date(Date.now() + delay * 1000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');
	await db.execute(
		`UPDATE webhook_queue
		   SET attempts = ?, last_error = ?, next_retry_at = ?, status = 'pending'
		 WHERE id = ?`,
		[attempts, error.slice(0, 1000), nextRetry, id]
	);
	log.warn('Job retry scheduled', { id, attempts, nextRetry });
}

export async function listJobs(params: {
	status?: WebhookStatus;
	source?: string;
	limit?: number;
	offset?: number;
}): Promise<WebhookJob[]> {
	const db = await getDb();
	const limit = Math.max(1, Math.min(params.limit ?? 50, 200));
	const offset = Math.max(0, params.offset ?? 0);
	const conditions: string[] = [];
	const args: any[] = [];
	if (params.status) {
		conditions.push('status = ?');
		args.push(params.status);
	}
	if (params.source) {
		conditions.push('source = ?');
		args.push(params.source);
	}
	const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
	const [rows] = await db.query(
		`SELECT * FROM webhook_queue ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
		args
	);
	return rows as WebhookJob[];
}
