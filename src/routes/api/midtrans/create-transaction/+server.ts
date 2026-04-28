import { json } from '@sveltejs/kit';
import { createMidtransTransaction } from '$lib/server/midtrans';
import { createPaymentTransaction } from '$lib/server/payment-transactions';
import { buildMidtransOrderId } from '$lib/server/midtrans-order-id';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { userId, invitationId, packageType, additionalGuests = 0 } = body;

		if (!userId || !invitationId || !packageType) {
			return json(
				{ error: 'Missing required fields: userId, invitationId, packageType' },
				{ status: 400 }
			);
		}

		// Generate unique order ID
		const orderId = buildMidtransOrderId('premium', uuidv4());

		// Calculate amount
		const baseAmount = packageType === 'premium' ? 99000 : 49000;
		const additionalGuestCost = additionalGuests * 19000;
		const totalAmount = baseAmount + additionalGuestCost;

		// Create Midtrans transaction
		const snapTransaction = await createMidtransTransaction({
			orderId,
			amount: totalAmount,
			customer: {
				name: 'User', // Will be populated from frontend
				email: 'user@example.com' // Will be populated from frontend
			},
			item: {
				id: packageType,
				name: `Undangan Pernikahan - ${packageType.toUpperCase()} Package`,
				price: baseAmount,
				quantity: 1
			}
		});

		// Create payment transaction record
		await createPaymentTransaction(userId, orderId, packageType as 'premium' | 'addon', totalAmount);

		console.log('[Payment API] Transaction created successfully:', {
			orderId,
			amount: totalAmount,
			snapToken: snapTransaction.token ? 'generated' : 'missing'
		});

		return json({
			success: true,
			orderId,
			snapToken: snapTransaction.token,
			redirectUrl: snapTransaction.redirect_url,
			amount: totalAmount
		});
	} catch (error) {
		console.error('[Payment API] Error creating transaction:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		return json(
			{
				success: false,
				error: errorMessage,
				details: 'Gagal membuat transaksi Snap. Pastikan Server Key benar, mode Sandbox/Production sesuai key, lalu simpan ulang di Admin Settings.'
			},
			{ status: 500 }
		);
	}
};
