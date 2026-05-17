import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getPromoCodeByCode, incrementPromoCodeUsage } from '$lib/server/promo-codes';
import { createMidtransTransaction } from '$lib/server/midtrans';
import { buildMidtransOrderId } from '$lib/server/midtrans-order-id';
import { createPaymentTransaction } from '$lib/server/payment-transactions';
import { updateUserAccess } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { logAudit } from '$lib/server/audit-log';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, '/login');

	const packageSlug = url.searchParams.get('package') || 'premium';

	// Get pricing from settings
	const [premiumPrice, addonGuestPrice, addonGuestQuantity] = await Promise.all([
		getSetting('premium_price'),
		getSetting('addon_guest_price'),
		getSetting('addon_guest_quantity')
	]);

	let packageName = '';
	let packageDesc = '';
	let packagePrice = 0;

	if (packageSlug === 'premium') {
		packageName = 'Premium';
		packageDesc = 'Langganan bulanan akses premium';
		packagePrice = parseInt(premiumPrice || '39000');
	} else if (packageSlug === 'addon-guest') {
		packageName = 'Add-on Tamu';
		packageDesc = `Tambahan ${addonGuestQuantity || '50'} kuota tamu`;
		packagePrice = parseInt(addonGuestPrice || '19000');
	} else {
		return {
			error: 'Paket tidak ditemukan.'
		};
	}

	// Process promo code
	const promoCode = url.searchParams.get('promo');
	let promo = null;
	let discount = 0;
	let finalPrice = packagePrice;

	if (promoCode) {
		promo = await getPromoCodeByCode(promoCode);
		if (!promo) {
			return {
				error: 'Kode promo tidak valid atau sudah kadaluwarsa.',
				packageName,
				packageDesc,
				originalPrice: packagePrice
			};
		}
		// Calculate discount
		if (promo.discount_fixed > 0) {
			discount = promo.discount_fixed;
		} else if (promo.discount_percent > 0) {
			discount = Math.round(packagePrice * promo.discount_percent / 100);
		}
		finalPrice = Math.max(0, packagePrice - discount);
	}

	const amount = finalPrice;
	const itemName = `${packageName} - ${packageDesc}`;
	const itemId = `PKG_${packageSlug.toUpperCase()}`;

	// Handle free transaction (100% discount)
	if (amount === 0) {
		// Directly activate access without payment
		const orderType = packageSlug === 'addon-guest' ? 'addon' : 'premium';
		const orderId = buildMidtransOrderId(orderType, locals.user.id);

		try {
			// Store transaction record
			await createPaymentTransaction(locals.user.id, orderId, orderType as 'premium' | 'addon', 0);

			// Activate user access
			if (orderType === 'premium') {
				const subEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
					.toISOString().slice(0, 19).replace('T', ' ');
				await updateUserAccess(locals.user.id, 1, 'paid', 5, 100, subEndsAt);
			} else if (orderType === 'addon') {
				const guestQuantity = parseInt((await getSetting('addon_guest_quantity')) || '50');
				await updateUserAccess(locals.user.id, 1, 'paid', undefined, guestQuantity);
			}

			// Increment promo code usage
			if (promo) {
				await incrementPromoCodeUsage(promo.code);
				await logAudit({
					action: 'promo_code.used',
					userId: locals.user.id,
					email: locals.user.email,
					details: `Promo ${promo.code} used on ${packageName} (FREE)`
				});
			}

			await logAudit({
				action: 'payment.free_activation',
				userId: locals.user.id,
				email: locals.user.email,
				details: `Free ${packageName} activated via promo code ${promo?.code || 'unknown'}`
			});

			// Redirect to billing with success message
			throw redirect(302, '/dashboard/billing?success=free');
		} catch (err) {
			if (err instanceof Response) throw err; // Re-throw redirect
			console.error('[Free Activation] Error:', err);
			return {
				error: 'Gagal mengaktifkan paket gratis. Silakan hubungi admin.',
				packageName,
				packageDesc,
				promo: promo ? { code: promo.code, discount, discountPercent: promo.discount_percent, discountFixed: promo.discount_fixed } : null,
				originalPrice: packagePrice,
				discount,
				finalPrice
			};
		}
	}

	// Get Midtrans settings
	const [clientKey, appName, isProdSetting] = await Promise.all([
		getSetting('midtrans_client_key'),
		getSetting('app_name'),
		getSetting('midtrans_is_production')
	]);
	const isProduction = isProdSetting === '1';
	const clientKeyTrim = (clientKey || '').trim();

	if (!clientKeyTrim) {
		return {
			error:
				'Midtrans Client Key belum diisi. Tambahkan Client Key di Admin -> App Settings (Sandbox/Production harus cocok dengan Server Key).',
			isProduction,
			clientKey: null,
			packageName,
			packageDesc,
			promo: promo ? { code: promo.code, discount, discountPercent: promo.discount_percent, discountFixed: promo.discount_fixed } : null,
			originalPrice: packagePrice,
			discount,
			finalPrice
		};
	}

	const orderType = packageSlug === 'addon-guest' ? 'addon' : 'premium';
	const orderId = buildMidtransOrderId(orderType, locals.user.id);

	try {
		const transaction = await createMidtransTransaction({
			orderId,
			amount,
			customer: {
				name: locals.user.username,
				email: locals.user.email
			},
			item: {
				id: itemId,
				name: itemName,
				price: amount,
				quantity: 1
			}
		});

		// Store transaction record for webhook lookup
		await createPaymentTransaction(locals.user.id, orderId, orderType as 'premium' | 'addon', amount);

		// Increment promo code usage if promo was applied
		if (promo) {
			await incrementPromoCodeUsage(promo.code);
			logAudit({
				action: 'promo_code.used',
				userId: locals.user.id,
				email: locals.user.email,
				details: `Promo ${promo.code} used on ${packageName}`
			});
		}

		return {
			snapToken: transaction.token,
			clientKey: clientKeyTrim,
			isProduction,
			amount,
			itemName,
			orderId,
			packageName,
			packageDesc,
			packageSlug,
			promo: promo ? { code: promo.code, discount, discountPercent: promo.discount_percent, discountFixed: promo.discount_fixed } : null,
			originalPrice: packagePrice,
			discount,
			finalPrice
		};
	} catch (err: unknown) {
		console.error('[Midtrans] Error creating transaction:', err);
		const msg = err instanceof Error ? err.message : String(err);
		const userMsg =
			msg.includes('Midtrans API') || msg.includes('Server Key is not configured')
				? msg
				: 'Gagal membuat transaksi Snap. Pastikan Server Key benar, mode Sandbox/Production sesuai key, lalu simpan ulang di Admin Settings.';
		return {
			error: userMsg,
			isProduction,
			clientKey: null,
			packageName,
			packageDesc,
			promo: promo ? { code: promo.code, discount, discountPercent: promo.discount_percent, discountFixed: promo.discount_fixed } : null,
			originalPrice: packagePrice,
			discount,
			finalPrice
		};
	}
};

export const actions: Actions = {};
