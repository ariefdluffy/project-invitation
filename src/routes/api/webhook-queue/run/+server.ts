/**
 * Webhook queue runner.
 *
 * Manually trigger from admin panel or cron:
 *   POST /api/webhook-queue/run   (with admin session OR x-admin-token: WEBHOOK_RUNNER_TOKEN)
 *
 * For each due job, the runner re-executes the original handler. Currently
 * supports `source: 'midtrans'` by re-validating the signature and replaying
 * `processPaymentNotification` logic.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { claimDueJobs, markJobSuccess, markJobFailed } from '$lib/server/webhook-queue';
import { getSetting } from '$lib/server/settings';
import {
	findPaymentTransactionByOrderId,
	updatePaymentTransactionStatus
} from '$lib/server/payment-transactions';
import { updateUserAccess, addGuestLimitToUser, addTemplateQuotaToUser } from '$lib/server/users';
import { createLogger } from '$lib/server/logger';
import crypto from 'crypto';

const log = createLogger('WebhookRunner');

function isAuthorized(request: Request, locals: App.Locals): boolean {
	if (locals.user?.role === 'admin') return true;
	const tokenHeader = request.headers.get('x-admin-token');
	const expected = env.WEBHOOK_RUNNER_TOKEN;
	if (!expected) return false;
	if (!tokenHeader) return false;
	try {
		const a = Buffer.from(tokenHeader);
		const b = Buffer.from(expected);
		if (a.length !== b.length) return false;
		return crypto.timingSafeEqual(a, b);
	} catch {
		return false;
	}
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
	if (!isAuthorized(request, locals)) {
		return json({ error: 'unauthorized' }, { status: 401 });
	}

	const limit = Math.max(1, Math.min(parseInt(url.searchParams.get('limit') || '10'), 50));
	const jobs = await claimDueJobs(limit);
	log.info('Claimed jobs', { count: jobs.length });

	const results: { id: string; status: 'success' | 'failed'; error?: string }[] = [];

	for (const job of jobs) {
		const attempts = job.attempts + 1;
		try {
			let payload: any;
			try {
				payload = JSON.parse(job.payload);
			} catch {
				throw new Error('Invalid payload JSON');
			}

			if (job.source === 'midtrans') {
				await replayMidtrans(payload);
				await markJobSuccess(job.id);
				results.push({ id: job.id, status: 'success' });
			} else {
				throw new Error(`Unknown webhook source: ${job.source}`);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			await markJobFailed(job.id, msg, attempts, job.max_attempts);
			results.push({ id: job.id, status: 'failed', error: msg });
		}
	}

	return json({ processed: results.length, results });
};

async function replayMidtrans(body: any): Promise<void> {
	const orderId = body.order_id as string;
	const transactionStatus = body.transaction_status as string;
	const fraudStatus = body.fraud_status as string;

	if (
		transactionStatus !== 'capture' &&
		transactionStatus !== 'settlement' &&
		transactionStatus !== 'success'
	) {
		return;
	}
	if (fraudStatus === 'challenge') return;

	// Re-verify signature using current server key (defense in depth)
	const serverKey = (await getSetting('midtrans_server_key'))?.trim() || '';
	if (serverKey) {
		const sigStr = body.order_id + body.status_code + body.gross_amount + serverKey;
		const sig = crypto.createHash('sha512').update(sigStr).digest('hex');
		if (sig !== body.signature_key) {
			throw new Error('Signature mismatch on replay');
		}
	}

	// Idempotency
	const paymentTx = await findPaymentTransactionByOrderId(orderId);
	if (paymentTx?.status === 'success') {
		log.info('Already processed during replay', { orderId });
		return;
	}

	if (paymentTx) {
		const userId = paymentTx.user_id;
		if (paymentTx.type === 'premium') {
			await updateUserAccess(userId, 1, 'paid', 5, 100);
		} else if (paymentTx.type === 'addon') {
			const addonQuantity = parseInt((await getSetting('addon_guest_quantity')) || '50');
			await addGuestLimitToUser(userId, addonQuantity);
		} else if (paymentTx.type === 'template-expansion') {
			const templateQuantity = parseInt((await getSetting('template_expansion_quantity')) || '5');
			await addTemplateQuotaToUser(userId, templateQuantity);
		}
		await updatePaymentTransactionStatus(orderId, 'success');
		return;
	}

	// Legacy fallback
	const parts = orderId.split('__');
	if (parts.length < 2) return;
	const legacyType = parts[0];
	const userId = parts[1];
	if (legacyType === 'PREMIUM') {
		await updateUserAccess(userId, 1, 'paid', 5, 100);
	} else if (legacyType === 'ADDON') {
		const addonQuantity = parseInt((await getSetting('addon_guest_quantity')) || '50');
		await addGuestLimitToUser(userId, addonQuantity);
	} else if (legacyType === 'TEMPLATE_EXPANSION') {
		const templateQuantity = parseInt((await getSetting('template_expansion_quantity')) || '5');
		await addTemplateQuotaToUser(userId, templateQuantity);
	}
}
