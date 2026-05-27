import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

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
	access_expires_at: string | null;
	created_at: string;
}

/** Format Date ke MySQL DATETIME (YYYY-MM-DD HH:MM:SS). */
function toMysqlDateTime(d: Date): string {
	return d.toISOString().slice(0, 19).replace('T', ' ');
}

export async function createUser(username: string, email: string, password: string, role: string = 'user'): Promise<User> {
	const db = await getDb();
	const id = uuidv4();
	const hashedPassword = bcryptjs.hashSync(password, 10);

	// Set 3-day trial for new users
	const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
		.toISOString().slice(0, 19).replace('T', ' ');

	await db.execute(
		'INSERT INTO users (id, username, email, password, role, has_access, payment_status, invitation_limit, guest_limit, trial_ends_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[id, username, email, hashedPassword, role, 0, 'unpaid', 1, 50, trialEndsAt]
	);

	return { id, username, email, role, has_access: 0, payment_status: 'unpaid', invitation_limit: 1, guest_limit: 50, template_quota: 0, template_quota_used: 0, trial_ends_at: trialEndsAt, access_expires_at: null, created_at: new Date().toISOString() };
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

const USER_SELECT_COLS =
	'id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, trial_ends_at, access_expires_at, created_at';

export async function getUserById(id: string): Promise<User | null> {
	const db = await getDb();
	const [rows] = await db.execute(`SELECT ${USER_SELECT_COLS} FROM users WHERE id = ?`, [id]);
	const userRows = rows as User[];

	if (userRows.length > 0) {
		return userRows[0];
	}
	return null;
}

export async function getAllUsers(): Promise<User[]> {
	const db = await getDb();
	const [rows] = await db.execute(`SELECT ${USER_SELECT_COLS} FROM users`);
	return rows as User[];
}

/**
 * Generic user-access updater (digunakan oleh admin panel).
 * Hanya menerima primitif yang sesuai dengan kolom DB.
 */
export async function updateUserAccess(
	id: string,
	hasAccess: number,
	paymentStatus?: string,
	invitationLimit?: number,
	guestLimit?: number
): Promise<void> {
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

/**
 * Aktivasi paket Premium untuk user (dipakai webhook payment & free-promo activation).
 * Set has_access=1, payment_status='paid', dan opsional access_expires_at.
 */
export async function activatePremiumAccess(
	userId: string,
	options: {
		invitationLimit?: number;
		guestLimit?: number;
		expiresAt?: Date | null;
	} = {}
): Promise<void> {
	const db = await getDb();
	const {
		invitationLimit = 5,
		guestLimit = 100,
		expiresAt = null
	} = options;

	await db.execute(
		`UPDATE users
		 SET has_access = 1,
		     payment_status = 'paid',
		     invitation_limit = ?,
		     guest_limit = ?,
		     access_expires_at = ?
		 WHERE id = ?`,
		[invitationLimit, guestLimit, expiresAt ? toMysqlDateTime(expiresAt) : null, userId]
	);
}

/**
 * Get user by ID including password hash (untuk verifikasi password).
 * Jangan expose ke frontend.
 */
export async function getUserByIdWithPassword(id: string): Promise<(User & { password: string }) | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		`SELECT ${USER_SELECT_COLS}, password FROM users WHERE id = ?`,
		[id]
	);
	const userRows = rows as (User & { password: string })[];
	return userRows.length > 0 ? userRows[0] : null;
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
		`SELECT ${USER_SELECT_COLS} FROM users WHERE email = ?`,
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
		`SELECT ${USER_SELECT_COLS}, reset_token, reset_token_expires FROM users WHERE email = ?`,
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

export async function ensureAccessExpiresAtColumn(): Promise<void> {
	const db = await getDb();
	try {
		const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'access_expires_at'");
		if ((rows as any[]).length === 0) {
			console.log('Adding access_expires_at column to users table...');
			await db.execute(
				"ALTER TABLE users ADD COLUMN access_expires_at DATETIME NULL AFTER trial_ends_at"
			);
		}
	} catch (err) {
		console.error('Migration Error (access_expires_at):', err);
	}
}

/**
 * Mark expired trials and expired paid subscriptions sebagai 'unpaid' / has_access=0.
 * Dipanggil pada startup; idempotent dan aman dijalankan ulang.
 */
export async function expireFinishedAccess(): Promise<{ trialsExpired: number; paidExpired: number }> {
	const db = await getDb();
	const now = toMysqlDateTime(new Date());

	// Trials yang sudah lewat: hanya update kalau user belum di-upgrade ke paid
	const [trialRes]: any = await db.execute(
		`UPDATE users
		 SET payment_status = 'expired'
		 WHERE trial_ends_at IS NOT NULL
		   AND trial_ends_at < ?
		   AND has_access = 0
		   AND payment_status = 'unpaid'`,
		[now]
	);

	// Paid subscription expired
	const [paidRes]: any = await db.execute(
		`UPDATE users
		 SET has_access = 0,
		     payment_status = 'expired'
		 WHERE access_expires_at IS NOT NULL
		   AND access_expires_at < ?
		   AND has_access = 1
		   AND role <> 'admin'`,
		[now]
	);

	const trialsExpired = trialRes?.affectedRows ?? 0;
	const paidExpired = paidRes?.affectedRows ?? 0;
	if (trialsExpired > 0 || paidExpired > 0) {
		console.log(`[Users] Expired access marked - trials: ${trialsExpired}, paid: ${paidExpired}`);
	}
	return { trialsExpired, paidExpired };
}

export function isUserInTrial(user: User): boolean {
	if (!user.trial_ends_at) return false;
	return new Date(user.trial_ends_at) > new Date();
}

export function isPaidAccessExpired(user: User): boolean {
	if (!user.access_expires_at) return false;
	return new Date(user.access_expires_at) <= new Date();
}

export function hasActiveAccess(user: User): boolean {
	if (user.has_access === 1) {
		// Kalau ada expiry & sudah lewat, dianggap tidak aktif
		if (user.access_expires_at && isPaidAccessExpired(user)) return false;
		return true;
	}
	return isUserInTrial(user);
}
