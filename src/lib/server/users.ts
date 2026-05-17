import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export interface User {
	id: string;
	username: string;
	email: string;
	password?: string;
	role: string;
	has_access: number;
	payment_status: string;
	invitation_limit: number;
	guest_limit: number;
	template_quota: number;
	template_quota_used: number;
	trial_ends_at: string | null;
	email_verified: number;
	email_verify_token: string | null;
	email_verify_expires: string | null;
	created_at: string;
}

export async function createUser(username: string, email: string, password: string, role: string = 'user', emailVerified: boolean = false): Promise<User> {
	const db = await getDb();
	const id = uuidv4();
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const emailVerifyToken = crypto.randomBytes(32).toString('hex');

	// Set 3-day trial for new users
	const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
		.toISOString().slice(0, 19).replace('T', ' ');
	const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
		.toISOString().slice(0, 19).replace('T', ' ');

	await db.execute(
		'INSERT INTO users (id, username, email, password, role, has_access, payment_status, invitation_limit, guest_limit, trial_ends_at, email_verified, email_verify_token, email_verify_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[id, username, email, hashedPassword, role, 0, 'unpaid', 1, 50, trialEndsAt, emailVerified ? 1 : 0, emailVerified ? null : emailVerifyToken, emailVerified ? null : verifyExpires]
	);

	return { id, username, email, role, has_access: 0, payment_status: 'unpaid', invitation_limit: 1, guest_limit: 50, template_quota: 0, template_quota_used: 0, trial_ends_at: trialEndsAt, email_verified: emailVerified ? 1 : 0, email_verify_token: emailVerified ? null : emailVerifyToken, email_verify_expires: emailVerified ? null : verifyExpires, created_at: new Date().toISOString() };
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
	const userRows = rows as (User & { password: string })[];

	if (userRows.length > 0) {
		const row = userRows[0];
		if (bcryptjs.compareSync(password, row.password)) {
			const { password: _, ...user } = row;
			return user;
		}
	}
	return null;
}

export async function getUserById(id: string): Promise<User | null> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, trial_ends_at, created_at FROM users WHERE id = ?', [id]);
	const userRows = rows as User[];

	if (userRows.length > 0) {
		return userRows[0];
	}
	return null;
}

export async function getAllUsers(): Promise<User[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, trial_ends_at, created_at FROM users');
	return rows as User[];
}

export async function updateUserAccess(id: string, hasAccess: number, paymentStatus?: string, invitationLimit?: number, guestLimit?: number): Promise<void> {
	const db = await getDb();
	const fields = ['has_access = ?'];
	const values: any[] = [hasAccess];

	if (paymentStatus !== undefined) {
		fields.push('payment_status = ?');
		values.push(paymentStatus);
	}

	if (invitationLimit !== undefined) {
		fields.push('invitation_limit = ?');
		values.push(invitationLimit);
	}

	if (guestLimit !== undefined) {
		fields.push('guest_limit = ?');
		values.push(guestLimit);
	}

	values.push(id);
	await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteUser(id: string): Promise<void> {
	const db = await getDb();
	await db.execute('DELETE FROM users WHERE id = ?', [id]);
}

export async function addGuestLimitToUser(id: string, amount: number): Promise<void> {
	const db = await getDb();
	await db.execute('UPDATE users SET guest_limit = guest_limit + ? WHERE id = ?', [amount, id]);
}

export async function addTemplateQuotaToUser(id: string, amount: number): Promise<void> {
	const db = await getDb();
	await db.execute('UPDATE users SET template_quota = template_quota + ? WHERE id = ?', [amount, id]);
}

export async function updateUserPassword(id: string, newPassword: string): Promise<void> {
	const db = await getDb();
	const hashedPassword = bcryptjs.hashSync(newPassword, 10);
	await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
}

export async function ensureGuestLimitColumn(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'guest_limit'");
		if ((rows as any[]).length === 0) {
			console.log('Adding guest_limit column to users table...');
			await db.execute("ALTER TABLE users ADD COLUMN guest_limit INT DEFAULT 50 AFTER invitation_limit");
		}
	} catch (err) {
		console.error('Migration Error (guest_limit):', err);
	}
}

// ─── Forgot Password / Reset Token ───────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, created_at FROM users WHERE email = ?',
		[email]
	);
	const userRows = rows as User[];
	return userRows.length > 0 ? userRows[0] : null;
}

export async function saveResetToken(userId: string, hashedToken: string, expiresAt: Date): Promise<void> {
	const db = await getDb();
	await db.execute(
		'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
		[hashedToken, expiresAt.toISOString().slice(0, 19).replace('T', ' '), userId]
	);
}

export async function verifyResetToken(email: string, token: string): Promise<User | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, created_at, reset_token, reset_token_expires FROM users WHERE email = ?',
		[email]
	);
	const userRows = rows as (User & { reset_token: string | null; reset_token_expires: string | null })[];

	if (userRows.length === 0) return null;

	const user = userRows[0];
	if (!user.reset_token || !user.reset_token_expires) return null;

	// Check expiry
	const expiresAt = new Date(user.reset_token_expires + 'Z').getTime();
	if (Date.now() > expiresAt) return null;

	// Verify token
	if (!bcryptjs.compareSync(token, user.reset_token)) return null;

	const { reset_token: _, reset_token_expires: __, ...userWithoutToken } = user;
	return userWithoutToken;
}

export async function clearResetToken(userId: string): Promise<void> {
	const db = await getDb();
	await db.execute(
		'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
		[userId]
	);
}

export async function ensureResetTokenColumns(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'reset_token'");
		if ((rows as any[]).length === 0) {
			console.log('Adding reset_token columns to users table...');
			await db.execute(
				"ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL AFTER template_quota_used"
			);
			await db.execute(
				"ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token"
			);
		}
	} catch (err) {
		console.error('Migration Error (reset_token):', err);
	}
}

export async function ensureTrialColumn(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'trial_ends_at'");
		if ((rows as any[]).length === 0) {
			console.log('Adding trial_ends_at column to users table...');
			await db.execute(
				"ALTER TABLE users ADD COLUMN trial_ends_at DATETIME NULL AFTER reset_token_expires"
			);
		}
	} catch (err) {
		console.error('Migration Error (trial_ends_at):', err);
	}
}

export async function ensureEmailVerifyColumns(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'email_verified'");
		if ((rows as any[]).length === 0) {
			console.log('Adding email verification columns to users table...');
			await db.execute(
				"ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0 AFTER trial_ends_at"
			);
			await db.execute(
				"ALTER TABLE users ADD COLUMN email_verify_token VARCHAR(255) NULL AFTER email_verified"
			);
			await db.execute(
				"ALTER TABLE users ADD COLUMN email_verify_expires DATETIME NULL AFTER email_verify_token"
			);
		}
	} catch (err) {
		console.error('Migration Error (email_verify):', err);
	}
}

export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT id, email_verify_token, email_verify_expires FROM users WHERE email_verify_token = ?',
		[token]
	);
	const userRows = rows as { id: string; email_verify_token: string | null; email_verify_expires: string | null }[];

	if (userRows.length === 0) {
		return { success: false, error: 'Token tidak valid' };
	}


	const user = userRows[0];
	if (!user.email_verify_token || !user.email_verify_expires) {
		return { success: false, error: 'Token tidak valid' };
	}

	// Check expiry
	const expiresAt = new Date(user.email_verify_expires + 'Z').getTime();
	if (Date.now() > expiresAt) {
		return { success: false, error: 'Token sudah expired' };
	}

	// Update user
	await db.execute(
		'UPDATE users SET email_verified = 1, email_verify_token = NULL, email_verify_expires = NULL WHERE id = ?',
		[user.id]
	);

	return { success: true };
}

export function isUserInTrial(user: User): boolean {
	if (!user.trial_ends_at) return false;
	return new Date(user.trial_ends_at) > new Date();
}

export function hasActiveAccess(user: User): boolean {
	if (user.has_access === 1) return true;
	return isUserInTrial(user);
}
