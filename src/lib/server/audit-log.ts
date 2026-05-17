import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export type AuditAction =
	| 'user.login'
	| 'user.register'
	| 'user.resend_verification'
	| 'user.logout'
	| 'user.password_reset'
	| 'user.password_change'
	| 'invitation.create'
	| 'invitation.update'
	| 'invitation.delete'
	| 'invitation.publish'
	| 'invitation.unpublish'
	| 'invitation.duplicate'
	| 'payment.create'
	| 'payment.success'
	| 'payment.failed'
	| 'admin.user_create'
	| 'admin.user_update'
	| 'admin.user_delete'
	| 'admin.password_reset'
	| 'admin.settings_update'
	| 'trial.started'
	| 'trial.expired'
	| 'promo.used'
	| 'package.activate'
	| 'promo_code.used';

export async function logAudit(params: {
	action: AuditAction;
	userId: string | null;
	email?: string;
	details?: string;
	ip?: string;
	metadata?: Record<string, any>;
}): Promise<void> {
	try {
		const db = await getDb();
		const id = uuidv4();
		const metadata = params.metadata ? JSON.stringify(params.metadata) : null;
		await db.execute(
			`INSERT INTO audit_logs (id, action, user_id, email, details, ip, metadata)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[id, params.action, params.userId, params.email || null, params.details || null, params.ip || null, metadata]
		);
	} catch (err) {
		console.error('[AuditLog] Error logging:', err);
	}
}

export interface AuditEntry {
	id: string;
	action: string;
	user_id: string | null;
	email: string | null;
	details: string | null;
	ip: string | null;
	metadata: string | null;
	created_at: string;
}

export async function getAuditLogs(limit: number = 100, offset: number = 0): Promise<AuditEntry[]> {
	const db = await getDb();
	// Use string interpolation for LIMIT/OFFSET to avoid MySQL prepared statement issues
	const safeLimit = Math.max(1, Math.min(limit, 1000));
	const safeOffset = Math.max(0, offset);
	const [rows] = await db.query(
		`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
	);
	return rows as AuditEntry[];
}

export async function getAuditLogsByUser(userId: string, limit: number = 50): Promise<AuditEntry[]> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
		[userId, limit]
	);
	return rows as AuditEntry[];
}

export async function countAuditLogs(): Promise<number> {
	const db = await getDb();
	const [rows] = await db.execute('SELECT COUNT(*) as count FROM audit_logs');
	return (rows as any[])[0].count;
}

export async function ensureAuditLogsTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS audit_logs (
				id VARCHAR(36) PRIMARY KEY,
				action VARCHAR(50) NOT NULL,
				user_id VARCHAR(36) NULL,
				email VARCHAR(100) NULL,
				details TEXT NULL,
				ip VARCHAR(45) NULL,
				metadata JSON NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				INDEX idx_action (action),
				INDEX idx_user_id (user_id),
				INDEX idx_created_at (created_at)
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) throw err;
	}
}
