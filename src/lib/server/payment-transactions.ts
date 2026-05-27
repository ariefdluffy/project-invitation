import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentTransaction {
	id: string;
	user_id: string;
	order_id: string;
	type: 'premium' | 'addon';
	amount: number;
	status: 'pending' | 'success' | 'failed' | 'cancelled';
	promo_code: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Create payment transaction record (saat Snap token dibuat)
 */
export async function createPaymentTransaction(
	userId: string,
	orderId: string,
	type: 'premium' | 'addon',
	amount: number,
	promoCode: string | null = null
): Promise<PaymentTransaction> {
	const db = await getDb();
	const id = uuidv4();
	const now = new Date();
	// Format untuk MySQL: YYYY-MM-DD HH:MM:SS
	const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

	await db.execute(
		'INSERT INTO payment_transactions (id, user_id, order_id, type, amount, status, promo_code, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[id, userId, orderId, type, amount, 'pending', promoCode, formattedNow, formattedNow]
	);

	return {
		id,
		user_id: userId,
		order_id: orderId,
		type,
		amount,
		status: 'pending',
		promo_code: promoCode,
		created_at: formattedNow,
		updated_at: formattedNow
	};
}

/**
 * Find payment transaction by order_id
 */
export async function findPaymentTransactionByOrderId(orderId: string): Promise<PaymentTransaction | null> {
	const db = await getDb();
	const [rows] = await db.execute(
		'SELECT id, user_id, order_id, type, amount, status, promo_code, created_at, updated_at FROM payment_transactions WHERE order_id = ?',
		[orderId]
	);
	const transRows = rows as PaymentTransaction[];

	if (transRows.length > 0) {
		return transRows[0];
	}
	return null;
}

/**
 * Update payment transaction status
 */
export async function updatePaymentTransactionStatus(
	orderId: string,
	status: 'success' | 'failed' | 'cancelled'
): Promise<void> {
	const db = await getDb();
	const now = new Date();
	// Format untuk MySQL: YYYY-MM-DD HH:MM:SS (sama seperti createPaymentTransaction)
	const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

	await db.execute(
		'UPDATE payment_transactions SET status = ?, updated_at = ? WHERE order_id = ?',
		[status, formattedNow, orderId]
	);
}

/**
 * Ensure payment_transactions table exists (run on app startup)
 */
export async function ensurePaymentTransactionsTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS payment_transactions (
				id VARCHAR(36) PRIMARY KEY,
				user_id VARCHAR(36) NOT NULL,
				order_id VARCHAR(50) NOT NULL UNIQUE,
				type ENUM('premium', 'addon') NOT NULL,
				amount INT NOT NULL,
				status ENUM('pending', 'success', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
				promo_code VARCHAR(50) NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				INDEX idx_user_id (user_id),
				INDEX idx_order_id (order_id),
				INDEX idx_status (status)
			)
		`);
		console.log('[DB] payment_transactions table ensured');

		// Migration: tambah promo_code jika belum ada (untuk DB lama)
		const [cols] = await db.execute(
			"SHOW COLUMNS FROM payment_transactions LIKE 'promo_code'"
		);
		if ((cols as any[]).length === 0) {
			console.log('[DB] Adding promo_code column to payment_transactions...');
			await db.execute(
				'ALTER TABLE payment_transactions ADD COLUMN promo_code VARCHAR(50) NULL AFTER status'
			);
		}
	} catch (err) {
		if (!(err instanceof Error && err.message.includes('already exists'))) {
			console.error('[DB] Error creating payment_transactions table:', err);
			throw err;
		}
	}
}
