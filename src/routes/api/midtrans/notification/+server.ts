import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateUserAccess, addGuestLimitToUser, addTemplateQuotaToUser } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { findPaymentTransactionByOrderId, updatePaymentTransactionStatus } from '$lib/server/payment-transactions';
import { createLogger } from '$lib/server/logger';
import { enqueueWebhook } from '$lib/server/webhook-queue';
import crypto from 'crypto';

const log = createLogger('MidtransNotify');

// Midtrans IP ranges for production and sandbox
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

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Optional IP whitelist: verify request comes from Midtrans IP range
	const clientIp = getClientAddress();
	if (!MIDTRANS_IPS.has(clientIp)) {
		log.warn('Notification from unknown IP', { ip: clientIp });
	}

	const body = await request.json();
	const serverKey = (await getSetting('midtrans_server_key'))?.trim() || '';

	// Verify Signature
	const signatureStr = body.order_id + body.status_code + body.gross_amount + serverKey;
	const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

	if (signature !== body.signature_key) {
		log.error('Invalid signature key', { orderId: body.order_id });
		return json({ status: 'error', message: 'Invalid Signature' }, { status: 403 });
	}

	const orderId = body.order_id as string;
	const transactionStatus = body.transaction_status;
	const fraudStatus = body.fraud_status;

	log.info('Notification received', { orderId, transactionStatus });

	// Wrap downstream side-effects in try/catch — if any DB write fails, the
	// webhook is enqueued for retry so we never lose a payment notification.
	try {
		await processPaymentNotification(orderId, transactionStatus, fraudStatus);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		log.error('Processing failed, enqueueing for retry', { orderId, error: msg });
		await enqueueWebhook({
			direction: 'inbound',
			source: 'midtrans',
			payload: body,
			delaySeconds: 30
		});
		// Still ack 200 so Midtrans does not retry uncontrolled — our queue handles retry.
	}

	return json({ status: 'ok' });
};

async function processPaymentNotification(
	orderId: string,
	transactionStatus: string,
	fraudStatus: string
): Promise<void> {
	if (
		transactionStatus !== 'capture' &&
		transactionStatus !== 'settlement' &&
		transactionStatus !== 'success'
	) {
		return;
	}

	if (fraudStatus === 'challenge') {
		log.info('Payment challenge', { orderId });
		return;
	}

	// Idempotency: skip if this transaction is already marked success.
	const paymentTx = await findPaymentTransactionByOrderId(orderId);
	if (paymentTx?.status === 'success') {
		log.info('Already processed, skipping', { orderId });
		return;
	}

	if (paymentTx) {
		const userId = paymentTx.user_id;
		log.info('Payment success', { orderId, userId });

		if (paymentTx.type === 'premium') {
			log.info('Activating premium', { userId });
			const subEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
				.toISOString().slice(0, 19).replace('T', ' ');
			await updateUserAccess(userId, 1, 'paid', 5, 100, subEndsAt);
		} else if (paymentTx.type === 'addon') {
			const addonQuantity = parseInt((await getSetting('addon_guest_quantity')) || '50');
			log.info('Adding guest limit', { userId, addonQuantity });
			await addGuestLimitToUser(userId, addonQuantity);
		} else if (paymentTx.type === 'template-expansion') {
			const templateQuantity = parseInt((await getSetting('template_expansion_quantity')) || '5');
			log.info('Adding template quota', { userId, templateQuantity });
			await addTemplateQuotaToUser(userId, templateQuantity);
		}

		await updatePaymentTransactionStatus(orderId, 'success');
		return;
	}

	/* Legacy: PREMIUM__uuid__ts atau ADDON__uuid__ts */
	const parts = orderId.split('__');
	if (parts.length < 2) {
		log.warn('Cannot parse legacy order_id', { orderId });
		return;
	}
	const legacyType = parts[0];
	const userId = parts[1];
	if (legacyType === 'PREMIUM') {
		log.info('Activating premium (legacy)', { userId });
		const subEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			.toISOString().slice(0, 19).replace('T', ' ');
		await updateUserAccess(userId, 1, 'paid', 5, 100, subEndsAt);
	} else if (legacyType === 'ADDON') {
		const addonQuantity = parseInt((await getSetting('addon_guest_quantity')) || '50');
		log.info('Adding guest limit (legacy)', { userId, addonQuantity });
		await addGuestLimitToUser(userId, addonQuantity);
	} else if (legacyType === 'TEMPLATE_EXPANSION') {
		const templateQuantity = parseInt((await getSetting('template_expansion_quantity')) || '5');
		log.info('Adding template quota (legacy)', { userId, templateQuantity });
		await addTemplateQuotaToUser(userId, templateQuantity);
	}
}
