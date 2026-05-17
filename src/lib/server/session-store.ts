/**
 * Server-side session store backed by MySQL.
 *
 * Each successful login creates a row in `sessions` and stores its `id` (UUID)
 * inside the signed cookie payload. The session token cannot be re-used after
 * the row is revoked or deleted, which gives us:
 *  - "Logout from this device" / "logout all devices"
 *  - Forced revocation when an account is compromised
 *  - Server-side expiry independent of cookie maxAge
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getDb } from './db';
import { createLogger } from './logger';

const log = createLogger('SessionStore');

export interface SessionRecord {
	id: string;
	user_id: string;
	user_agent: string | null;
	ip: string | null;
	created_at: string;
	last_seen_at: string;
	expires_at: string;
	revoked_at: string | null;
}

export async function ensureSessionsTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS sessions (
				id VARCHAR(64) PRIMARY KEY,
				user_id VARCHAR(36) NOT NULL,
				user_agent VARCHAR(255) NULL,
				ip VARCHAR(45) NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				expires_at TIMESTAMP NULL,
				revoked_at TIMESTAMP NULL,
				INDEX idx_user (user_id),
				INDEX idx_expires (expires_at)
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) {
			log.error('Failed to ensure sessions table', { error: err.message });
			throw err;
		}
	}
}

/**
 * Create a new server-side session and return its id.
 */
export async function createSession(params: {
	userId: string;
	userAgent?: string | null;
	ip?: string | null;
	ttlSeconds: number;
}): Promise<string> {
	const db = await getDb();
	const id = uuidv4();
	const expiresAt = new Date(Date.now() + params.ttlSeconds * 1000)
		.toISOString()
		.slice(0, 19)
		.replace('T', ' ');

	await db.execute(
		'INSERT INTO sessions (id, user_id, user_agent, ip, expires_at) VALUES (?, ?, ?, ?, ?)',
		[
			id,
			params.userId,
			(params.userAgent || '').slice(0, 250) || null,
			params.ip || null,
			expiresAt
		]
	);

	return id;
}

/**
 * Lookup an active (non-revoked, non-expired) session by id.
 * Returns the session row or null. Also bumps `last_seen_at` lazily.
 */
export async function getActiveSession(sessionId: string): Promise<SessionRecord | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		`SELECT id, user_id, user_agent, ip, created_at, last_seen_at, expires_at, revoked_at
		 FROM sessions
		 WHERE id = ?
		   AND revoked_at IS NULL
		   AND (expires_at IS NULL OR expires_at > NOW())
		 LIMIT 1`,
		[sessionId]
	);
	const list = rows as SessionRecord[];
	if (list.length === 0) return null;

	// Lazy update last_seen_at (best-effort, non-blocking)
	db.execute('UPDATE sessions SET last_seen_at = NOW() WHERE id = ?', [sessionId]).catch(() => {});

	return list[0];
}

/**
 * Revoke a single session.
 */
export async function revokeSession(sessionId: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		'UPDATE sessions SET revoked_at = NOW() WHERE id = ? AND revoked_at IS NULL',
		[sessionId]
	);
}

/**
 * Revoke all sessions belonging to a user. Used for "logout all devices",
 * password change, or admin-forced revocation.
 */
export async function revokeAllSessionsForUser(userId: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		'UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
		[userId]
	);
}

/**
 * List active sessions for a user (for the "active devices" UI).
 */
export async function listActiveSessionsForUser(userId: string): Promise<SessionRecord[]> {
	const db = await getDb();
	const [rows] = await db.execute(
		`SELECT id, user_id, user_agent, ip, created_at, last_seen_at, expires_at, revoked_at
		 FROM sessions
		 WHERE user_id = ?
		   AND revoked_at IS NULL
		   AND (expires_at IS NULL OR expires_at > NOW())
		 ORDER BY last_seen_at DESC`,
		[userId]
	);
	return rows as SessionRecord[];
}

/**
 * Periodically purge expired/revoked sessions older than `daysToKeep` days.
 * Call from a scheduler. Safe to invoke; uses bounded DELETE.
 */
export async function purgeOldSessions(daysToKeep: number = 30): Promise<number> {
	const db = await getDb();
	const [result] = await db.execute(
		`DELETE FROM sessions
		 WHERE (expires_at IS NOT NULL AND expires_at < NOW() - INTERVAL ? DAY)
		    OR (revoked_at IS NOT NULL AND revoked_at < NOW() - INTERVAL ? DAY)`,
		[daysToKeep, daysToKeep]
	);
	const r = result as { affectedRows?: number };
	return r.affectedRows || 0;
}

/**
 * Hash a value for safe storage (used internally if needed).
 */
export function sha256(value: string): string {
	return crypto.createHash('sha256').update(value).digest('hex');
}
