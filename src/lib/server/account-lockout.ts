/**
 * Account lockout helpers.
 *
 * Tracks failed login attempts per user and locks the account after the
 * configured threshold. Lock is automatically released after `LOCK_DURATION_MS`.
 *
 * This complements IP-based rate limiting: rate limit deters scripted attacks
 * across many accounts; lockout deters credential stuffing against a single
 * account from rotating IPs.
 */

import { getDb } from './db';
import { createLogger } from './logger';

const log = createLogger('AccountLockout');

const MAX_FAILED_ATTEMPTS = 10;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function ensureFailedLoginColumns(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute(
			"SHOW COLUMNS FROM users LIKE 'failed_login_attempts'"
		);
		if ((rows as any[]).length === 0) {
			log.info('Adding failed_login_attempts/locked_until columns');
			await db.execute(
				"ALTER TABLE users ADD COLUMN failed_login_attempts INT NOT NULL DEFAULT 0"
			);
			await db.execute(
				"ALTER TABLE users ADD COLUMN locked_until DATETIME NULL"
			);
		}
	} catch (err: any) {
		log.error('Migration failed', { error: err?.message });
	}
}

export interface LockState {
	locked: boolean;
	until?: Date;
}

/**
 * Check if an account is currently locked. Returns lock-until time if locked.
 */
export async function getLockState(email: string): Promise<LockState> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT locked_until FROM users WHERE email = ?',
		[email]
	);
	const list = rows as { locked_until: string | null }[];
	if (list.length === 0) return { locked: false };

	const lockedUntilStr = list[0].locked_until;
	if (!lockedUntilStr) return { locked: false };

	const until = new Date(lockedUntilStr + 'Z');
	if (until.getTime() > Date.now()) {
		return { locked: true, until };
	}
	return { locked: false };
}

/**
 * Record a failed login attempt. Returns updated lock state.
 */
export async function recordFailedLogin(email: string): Promise<LockState> {
	const db = await getDb();
	// Find user
	const [rows] = await db.execute(
		'SELECT id, failed_login_attempts FROM users WHERE email = ?',
		[email]
	);
	const list = rows as { id: string; failed_login_attempts: number }[];
	if (list.length === 0) return { locked: false };

	const newCount = (list[0].failed_login_attempts || 0) + 1;

	if (newCount >= MAX_FAILED_ATTEMPTS) {
		const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS)
			.toISOString()
			.slice(0, 19)
			.replace('T', ' ');
		await db.execute(
			'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
			[newCount, lockedUntil, list[0].id]
		);
		log.warn('Account locked due to repeated failed logins', {
			userId: list[0].id,
			attempts: newCount
		});
		return { locked: true, until: new Date(Date.now() + LOCK_DURATION_MS) };
	}

	await db.execute(
		'UPDATE users SET failed_login_attempts = ? WHERE id = ?',
		[newCount, list[0].id]
	);
	return { locked: false };
}

/**
 * Reset failed login counter (called on successful login).
 */
export async function clearFailedLogins(userId: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?',
		[userId]
	);
}

export const LOCKOUT_THRESHOLD = MAX_FAILED_ATTEMPTS;
export const LOCKOUT_DURATION_MS = LOCK_DURATION_MS;
