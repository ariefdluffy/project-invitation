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
	created_at: string;
}

export async function createUser(username: string, email: string, password: string, role: string = 'user'): Promise<User> {
	const db = await getDb();
	const id = uuidv4();
	const hashedPassword = bcryptjs.hashSync(password, 10);

	await db.execute(
		'INSERT INTO users (id, username, email, password, role, has_access, payment_status, invitation_limit, guest_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[id, username, email, hashedPassword, role, 0, 'unpaid', 1, 50]
	);

	return { id, username, email, role, has_access: 0, payment_status: 'unpaid', invitation_limit: 1, guest_limit: 50, created_at: new Date().toISOString() };
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
	const [rows] = await db.execute('SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, created_at FROM users WHERE id = ?', [id]);
	const userRows = rows as User[];

	if (userRows.length > 0) {
		return userRows[0];
	}
	return null;
}

export async function getAllUsers(): Promise<User[]> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, template_quota, template_quota_used, created_at FROM users');
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
