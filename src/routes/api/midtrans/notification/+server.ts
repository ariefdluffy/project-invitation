import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	activatePremiumAccess,
	addGuestLimitToUser,
	addTemplateQuotaToUser
} from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import {
	findPaymentTransactionByOrderId,
	updatePaymentTransactionStatus
} from '$lib/server/payment-transactions';
import { incrementPromoCodeUsage } from '$lib/server/promo-codes';
import { logAudit } from '$lib/server/audit-log';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';

// Midtrans IP ranges (production + sandbox)
// Source: https://docs.midtrans.com/en/other/security
const MIDTRANS_IPS = new Set([
	'103.10.63.10',
	'103.10.63.11',
	'103.10.63.12',
	'103.10.63.13',
	'103.10.63.19',
	'103.10.63.20',
	'103.28.30.71',
	'103.28.30.72',
	'103.28.30.73',
	'103.28.30.74',
	'103.28.30.75',
	'103.28.30.76',
	'103.28.30.77',
	'103.28.30.78',
	'103.28.30.79',
	'103.28.30.80',
	'103.28.30.81',
	'103.28.30.82',
	'103.28.30.83',
	'103.28.30.84',
	'103.28.30.85',
	'103.28.30.86',
	'103.28.30.87',
	'103.28.30.88',
	'103.28.30.89',
	'103.28.30.90',
	'103.28.30.91',
	'103.28.30.92',
	'103.28.30.93',
	'103.28.30.94',
	'103.28.30.95',
	'103.28.30.96',
	'103.28.30.97',
	'103.28.30.98',
	'103.28.30.99',
	'103.28.30.100'
]);

const PREMIUM_DURATION_DAYS = 30;
const DEFAULT_PREMIUM_INVITATION_LIMIT = 5;
const DEFAULT_PREMIUM_GUEST_LIMIT = 100;

function isProduction(): boolean {
	return env.NODE_ENV === 'production';
}

function isMidtransIp(ip: string): boolean {
	// Common proxy chain may produce "ip1, ip2"; ambil yang pertama
	const first = (ip || '').split(',')[0].trim();
	return MIDTRANS_IPS.has(first);
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const clientIp = getClientAddress();

	// IP whitelist - di production hanya terima dari Midtrans IP
	if (isProduction() && !isMidtransIp(clientIp)) {
		console.error(`[Midtrans] Blocked notification from non-Midtrans IP: ${clientIp}`);
		return json({ status: 'error', message: 'Forbidden' }, { status: 403 });
	}
	if (!isMidtransIp(clientIp)) {
		console.warn(
			`[Midtrans] Notification from non-Midtrans IP (dev only): ${clientIp}. Signature still verified.`
		);
	}

	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
	}

	const serverKey = (await getSetting('midtrans_server_key'))?.trim() || '';
	if (!serverKey) {
		console.error('[Midtrans] Server key not configured.');
		return json({ status: 'error', message: 'Server key not configured' }, { status: 500 });
	}

	// Verify Signature: SHA-512(order_id + status_code + gross_amount + serverKey)
	const signatureStr = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`;
	const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

	const expectedBuf = Buffer.from(signature);
	const providedBuf = Buffer.from(String(body.signature_key || ''));
	if (
		expectedBuf.length !== providedBuf.length ||
		!crypto.timingSafeEqual(expectedBuf, providedBuf)
	) {
		console.error('[Midtrans] Invalid signature for order:', body.order_id);
		return json({ status: 'error', message: 'Invalid Signature' }, { status: 403 });
	}

	const orderId = String(body.order_id);
	const transactionStatus = String(body.transaction_status);
	const fraudStatus = String(body.fraud_status || '');

	console.log(`[Midtrans] Notification received: ${orderId} - Status: ${transactionStatus}`);

	// Lookup tx terlebih dahulu untuk idempotency check
	const paymentTx = await findPaymentTransactionByOrderId(orderId);

	// Status sukses (capture/settlement)
	const isSuccessStatus =
		transactionStatus === 'capture' ||
		transactionStatus === 'settlement' ||
		transactionStatus === 'success';

	// Status gagal/dibatalkan
	const isFailureStatus =
		transactionStatus === 'cancel' ||
		transactionStatus === 'deny' ||
		transactionStatus === 'expire' ||
		transactionStatus === 'failure';

	if (isSuccessStatus) {
		if (fraudStatus === 'challenge') {
			console.log(`[Midtrans] Payment Challenge for ${orderId}`);
			return json({ status: 'ok' });
		}

		if (paymentTx) {
			// IDEMPOTENCY GUARD: jika sudah success, jangan proses ulang
			if (paymentTx.status === 'success') {
				console.log(`[Midtrans] Order ${orderId} sudah diproses sebelumnya. Skip.`);
				return json({ status: 'ok', message: 'Already processed' });
			}

			const userId = paymentTx.user_id;
			console.log(`[Midtrans] Payment Success for order ${orderId} - User: ${userId}`);

			try {
				if (paymentTx.type === 'premium') {
					const expiresAt = new Date();
					expiresAt.setDate(expiresAt.getDate() + PREMIUM_DURATION_DAYS);
					await activatePremiumAccess(userId, {
						invitationLimit: DEFAULT_PREMIUM_INVITATION_LIMIT,
						guestLimit: DEFAULT_PREMIUM_GUEST_LIMIT,
						expiresAt
					});
				} else if (paymentTx.type === 'addon') {
					const addonQuantity = parseInt(
						(await getSetting('addon_guest_quantity')) || '50'
					);
					await addGuestLimitToUser(userId, addonQuantity);
				} else if ((paymentTx.type as string) === 'template-expansion') {
					const templateQuantity = parseInt(
						(await getSetting('template_expansion_quantity')) || '5'
					);
					await addTemplateQuotaToUser(userId, templateQuantity);
				}

				// Tandai success SETELAH semua operasi user-side selesai
				await updatePaymentTransactionStatus(orderId, 'success');

				// Increment promo code usage hanya saat pembayaran sukses
				if (paymentTx.promo_code) {
					try {
						await incrementPromoCodeUsage(paymentTx.promo_code);
						logAudit({
							action: 'promo_code.used',
							userId,
							details: `Promo ${paymentTx.promo_code} confirmed (order ${orderId})`
						}).catch(() => {});
					} catch (err) {
						console.error(`[Midtrans] Failed to increment promo ${paymentTx.promo_code}:`, err);
					}
				}

				logAudit({
					action: 'payment.success',
					userId,
					details: `Order ${orderId} (${paymentTx.type}) success - Rp ${paymentTx.amount}`
				}).catch(() => {});
			} catch (err) {
				// Jika activation gagal, JANGAN tandai success - biar Midtrans retry
				console.error(`[Midtrans] Activation failed for ${orderId}:`, err);
				return json(
					{ status: 'error', message: 'Activation failed, will retry' },
					{ status: 500 }
				);
			}
		} else {
			// Legacy fallback: order_id tidak dikenali di tabel payment_transactions.
			// Tetap proses, tapi tidak ada idempotency guard di sini (legacy path).
			console.warn(
				`[Midtrans] Unknown order_id format (legacy/missing tx): ${orderId} - menolak untuk safety.`
			);
			return json(
				{ status: 'error', message: 'Unknown order_id, transaction record missing' },
				{ status: 404 }
			);
		}
	} else if (isFailureStatus) {
		if (paymentTx && paymentTx.status === 'pending') {
			const newStatus =
				transactionStatus === 'cancel'
					? 'cancelled'
					: transactionStatus === 'expire'
						? 'failed'
						: 'failed';
			await updatePaymentTransactionStatus(orderId, newStatus);

			logAudit({
				action: 'payment.failed',
				userId: paymentTx.user_id,
				details: `Order ${orderId} ${transactionStatus}`
			}).catch(() => {});
		}
	} else {
		// pending atau status lain - tidak ada aksi
		console.log(`[Midtrans] Order ${orderId} status ${transactionStatus} - no action taken`);
	}

	return json({ status: 'ok' });
};
