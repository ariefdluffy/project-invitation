/**
 * Background job queue (DB-backed).
 *
 * A lightweight, dependency-free job runner suitable for low-medium traffic.
 * Jobs are persisted in `background_jobs` and processed by an in-process worker
 * loop that wakes every `POLL_INTERVAL_MS` and picks up due jobs.
 *
 * Use cases:
 *  - Send emails asynchronously (don't block HTTP response on SMTP latency)
 *  - Image optimization (sharp resize/convert to webp)
 *  - Periodic cleanups (purge expired sessions, old uploads)
 *
 * Notes:
 *  - This is process-local; in PM2 cluster mode each worker polls. The
 *    SELECT...FOR UPDATE pattern prevents double-processing.
 *  - For high throughput migrate to BullMQ (Redis) — interface kept compatible.
 */

import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';
import { createLogger } from './logger';

const log = createLogger('JobQueue');

export type JobType =
	| 'email.send'
	| 'image.optimize'
	| 'session.purge'
	| 'audit.cleanup'
	| 'webhook.replay';

export type JobStatus = 'queued' | 'running' | 'success' | 'failed' | 'dead';

export interface JobRecord {
	id: string;
	type: JobType;
	payload: string;
	status: JobStatus;
	attempts: number;
	max_attempts: number;
	run_at: string;
	last_error: string | null;
	created_at: string;
	updated_at: string;
}

const POLL_INTERVAL_MS = 10_000;
const RETRY_BACKOFF_SECONDS = [15, 60, 300, 900, 3600];

let workerStarted = false;
const handlers = new Map<JobType, JobHandler>();

export type JobHandler = (payload: any, job: JobRecord) => Promise<void>;

/** Register a handler for a given job type. Idempotent. */
export function registerJobHandler(type: JobType, handler: JobHandler): void {
	handlers.set(type, handler);
}

export async function ensureBackgroundJobsTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS background_jobs (
				id VARCHAR(36) PRIMARY KEY,
				type VARCHAR(50) NOT NULL,
				payload MEDIUMTEXT NOT NULL,
				status ENUM('queued','running','success','failed','dead') NOT NULL DEFAULT 'queued',
				attempts INT NOT NULL DEFAULT 0,
				max_attempts INT NOT NULL DEFAULT 5,
				run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				last_error TEXT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				INDEX idx_status_run (status, run_at),
				INDEX idx_type (type)
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) {
			log.error('Failed to create background_jobs table', { error: err.message });
			throw err;
		}
	}
}

/**
 * Enqueue a new job. Returns its id.
 */
export async function enqueueJob(params: {
	type: JobType;
	payload: unknown;
	delaySeconds?: number;
	maxAttempts?: number;
}): Promise<string> {
	const db = await getDb();
	const id = uuidv4();
	const runAt = new Date(Date.now() + (params.delaySeconds ?? 0) * 1000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');

	await db.execute(
		`INSERT INTO background_jobs (id, type, payload, status, attempts, max_attempts, run_at)
		 VALUES (?, ?, ?, 'queued', 0, ?, ?)`,
		[id, params.type, JSON.stringify(params.payload), params.maxAttempts ?? 5, runAt]
	);

	log.debug('Job enqueued', { id, type: params.type, runAt });
	return id;
}

/**
 * Atomically claim a single due job by transitioning queued → running.
 * Returns null if no due job available.
 */
async function claimNextJob(): Promise<JobRecord | null> {
	const db = await getDb();
	const conn = await db.getConnection();
	try {
		await conn.beginTransaction();
		const [rows] = await conn.query(
			`SELECT * FROM background_jobs
			 WHERE status = 'queued' AND run_at <= NOW()
			 ORDER BY run_at ASC
			 LIMIT 1
			 FOR UPDATE SKIP LOCKED`
		);
		const list = rows as JobRecord[];
		if (list.length === 0) {
			await conn.commit();
			return null;
		}
		const job = list[0];
		await conn.execute(
			"UPDATE background_jobs SET status = 'running', attempts = attempts + 1 WHERE id = ?",
			[job.id]
		);
		await conn.commit();
		return { ...job, status: 'running', attempts: job.attempts + 1 };
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}
}

async function markSuccess(id: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		"UPDATE background_jobs SET status = 'success', last_error = NULL WHERE id = ?",
		[id]
	);
}

async function markFailed(job: JobRecord, error: string): Promise<void> {
	const db = await getDb();
	if (job.attempts >= job.max_attempts) {
		await db.execute(
			"UPDATE background_jobs SET status = 'dead', last_error = ? WHERE id = ?",
			[error.slice(0, 1000), job.id]
		);
		log.error('Job dead-lettered', { id: job.id, type: job.type });
		return;
	}
	const idx = Math.min(job.attempts, RETRY_BACKOFF_SECONDS.length - 1);
	const delay = RETRY_BACKOFF_SECONDS[idx];
	const nextRun = new Date(Date.now() + delay * 1000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');
	await db.execute(
		"UPDATE background_jobs SET status = 'queued', last_error = ?, run_at = ? WHERE id = ?",
		[error.slice(0, 1000), nextRun, job.id]
	);
	log.warn('Job retry scheduled', { id: job.id, type: job.type, nextRun });
}

async function processOne(): Promise<boolean> {
	let job: JobRecord | null;
	try {
		job = await claimNextJob();
	} catch (err) {
		log.error('claimNextJob failed', { error: (err as Error).message });
		return false;
	}
	if (!job) return false;

	const handler = handlers.get(job.type);
	if (!handler) {
		await markFailed(job, `No handler registered for type: ${job.type}`);
		return true;
	}

	let payload: any;
	try {
		payload = JSON.parse(job.payload);
	} catch {
		await markFailed(job, 'Invalid JSON payload');
		return true;
	}

	try {
		await handler(payload, job);
		await markSuccess(job.id);
		log.debug('Job completed', { id: job.id, type: job.type });
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		await markFailed(job, msg);
	}

	return true;
}

/**
 * Start the worker loop. Idempotent — safe to call multiple times.
 * In SvelteKit, call once from `hooks.server.ts` after `ensureBackgroundJobsTable()`.
 */
export function startJobWorker(): void {
	if (workerStarted) return;
	workerStarted = true;

	const tick = async () => {
		try {
			// Drain any due jobs each tick (up to a soft limit)
			for (let i = 0; i < 20; i++) {
				const processed = await processOne();
				if (!processed) break;
			}
		} catch (err) {
			log.error('Worker tick error', { error: (err as Error).message });
		} finally {
			setTimeout(tick, POLL_INTERVAL_MS).unref?.();
		}
	};

	setTimeout(tick, 1000).unref?.();
	log.info('Worker started', { pollIntervalMs: POLL_INTERVAL_MS });
}
