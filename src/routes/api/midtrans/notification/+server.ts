import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateUserAccess, addGuestLimitToUser, addTemplateQuotaToUser } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { parseMidtransOrderId, buildMidtransOrderId } from '$lib/server/midtrans-order-id';
import { findPaymentTransactionByOrderId, updatePaymentTransactionStatus } from '$lib/server/payment-transactions';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const serverKey = (await getSetting('midtrans_server_key'))?.trim() || '';

	// Verify Signature
	const signatureStr = body.order_id + body.status_code + body.gross_amount + serverKey;
	const signature = crypto.createHash('sha512').update(signatureStr).digest('hex');

	if (signature !== body.signature_key) {
		console.error('[Midtrans] Invalid Signature Key');
		return json({ status: 'error', message: 'Invalid Signature' }, { status: 403 });
	}

	const orderId = body.order_id as string;
	const transactionStatus = body.transaction_status;
	const fraudStatus = body.fraud_status;

	console.log(`[Midtrans] Notification received: ${orderId} - Status: ${transactionStatus}`);

	// Payment Success Logic
	if (
		transactionStatus === 'capture' || 
		transactionStatus === 'settlement' || 
		transactionStatus === 'success'
	) {
		if (fraudStatus === 'challenge') {
			console.log(`[Midtrans] Payment Challenge for ${orderId}`);
			return json({ status: 'ok' });
		}

		// Lookup transaction dari DB
		const paymentTx = await findPaymentTransactionByOrderId(orderId);
		if (paymentTx) {
			const userId = paymentTx.user_id;
					console.log(`[Midtrans] Payment Success for order ${orderId} - User: ${userId}`);
					
					if (paymentTx.type === 'premium') {
						console.log(`[Midtrans] Activating Premium for User: ${userId}`);
						await updateUserAccess(userId, 1, 'paid', 3);
					} else if (paymentTx.type === 'addon') {
						const addonQuantity = parseInt(await getSetting('addon_guest_quantity') || '50');
						console.log(`[Midtrans] Adding ${addonQuantity} guests for User: ${userId}`);
						await addGuestLimitToUser(userId, addonQuantity);
					} else if (paymentTx.type === 'template-expansion') {
						const templateQuantity = parseInt(await getSetting('template_expansion_quantity') || '5');
						console.log(`[Midtrans] Adding ${templateQuantity} templates for User: ${userId}`);
						await addTemplateQuotaToUser(userId, templateQuantity);
					}
			
			// Update transaction status
			await updatePaymentTransactionStatus(orderId, 'success');
		} else {
			/* Legacy: PREMIUM__uuid__ts atau ADDON__uuid__ts */
			const parts = orderId.split('__');
			if (parts.length < 2) {
				console.warn(`[Midtrans] Cannot parse legacy order_id: ${orderId}`);
				return json({ status: 'ok' });
			}
			const legacyType = parts[0];
			const userId = parts[1];
			if (legacyType === 'PREMIUM') {
				console.log(`[Midtrans] Activating Premium (legacy order_id) for User: ${userId}`);
				await updateUserAccess(userId, 1, 'paid', 3);
					} else if (legacyType === 'ADDON') {
						const addonQuantity = parseInt(await getSetting('addon_guest_quantity') || '50');
						console.log(`[Midtrans] Adding ${addonQuantity} guests (legacy) for User: ${userId}`);
						await addGuestLimitToUser(userId, addonQuantity);
					} else if (legacyType === 'TEMPLATE_EXPANSION') {
						const templateQuantity = parseInt(await getSetting('template_expansion_quantity') || '5');
						console.log(`[Midtrans] Adding ${templateQuantity} templates (legacy) for User: ${userId}`);
						await addTemplateQuotaToUser(userId, templateQuantity);
					}
		}
	}

	return json({ status: 'ok' });
};
