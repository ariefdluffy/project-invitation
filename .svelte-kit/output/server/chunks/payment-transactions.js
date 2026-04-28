import { t as getDb } from "./db.js";
import { v4 } from "uuid";
//#region src/lib/server/payment-transactions.ts
/**
* Create payment transaction record (saat Snap token dibuat)
*/
async function createPaymentTransaction(userId, orderId, type, amount) {
	const db = await getDb();
	const id = v4();
	const formattedNow = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
	await db.execute("INSERT INTO payment_transactions (id, user_id, order_id, type, amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
		id,
		userId,
		orderId,
		type,
		amount,
		"pending",
		formattedNow,
		formattedNow
	]);
	return {
		id,
		user_id: userId,
		order_id: orderId,
		type,
		amount,
		status: "pending",
		created_at: formattedNow,
		updated_at: formattedNow
	};
}
/**
* Find payment transaction by order_id
*/
async function findPaymentTransactionByOrderId(orderId) {
	const [rows] = await (await getDb()).execute("SELECT id, user_id, order_id, type, amount, status, created_at, updated_at FROM payment_transactions WHERE order_id = ?", [orderId]);
	const transRows = rows;
	if (transRows.length > 0) return transRows[0];
	return null;
}
/**
* Update payment transaction status
*/
async function updatePaymentTransactionStatus(orderId, status) {
	const db = await getDb();
	const formattedNow = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
	await db.execute("UPDATE payment_transactions SET status = ?, updated_at = ? WHERE order_id = ?", [
		status,
		formattedNow,
		orderId
	]);
}
/**
* Ensure payment_transactions table exists (run on app startup)
*/
async function ensurePaymentTransactionsTable() {
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
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				INDEX idx_user_id (user_id),
				INDEX idx_order_id (order_id),
				INDEX idx_status (status)
			)
		`);
		console.log("[DB] payment_transactions table ensured");
	} catch (err) {
		if (!(err instanceof Error && err.message.includes("already exists"))) {
			console.error("[DB] Error creating payment_transactions table:", err);
			throw err;
		}
	}
}
//#endregion
export { updatePaymentTransactionStatus as i, ensurePaymentTransactionsTable as n, findPaymentTransactionByOrderId as r, createPaymentTransaction as t };
