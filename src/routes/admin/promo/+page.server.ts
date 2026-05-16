import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getPromoCodes, createPromoCode, deletePromoCode } from '$lib/server/promo-codes';
import { logAudit } from '$lib/server/audit-log';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/login');
	}
	const promos = await getPromoCodes();
	return { promos };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403);
		const formData = await request.formData();
		const code = (formData.get('code') as string || '').toUpperCase();
		const discountPercent = parseInt(formData.get('discount_percent') as string) || 0;
		const discountFixed = parseInt(formData.get('discount_fixed') as string) || 0;
		const maxUses = parseInt(formData.get('max_uses') as string) || 0;
		const expiresAt = formData.get('expires_at') as string || null;

		if (!code) return fail(400, { error: 'Kode promo harus diisi' });
		if (discountPercent < 0 || discountPercent > 100) return fail(400, { error: 'Diskon persen antara 0-100' });

		try {
			await createPromoCode({ code, discount_percent: discountPercent, discount_fixed: discountFixed, max_uses: maxUses, expires_at: expiresAt || undefined });
			logAudit({ action: 'admin.settings_update', userId: locals.user.id, details: `Created promo code: ${code}` });
			return { success: true, message: `Kode promo ${code} berhasil dibuat` };
		} catch { return fail(400, { error: 'Kode promo mungkin sudah ada' }); }
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403);
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await deletePromoCode(id);
		logAudit({ action: 'admin.settings_update', userId: locals.user.id, details: `Deleted promo code ${id}` });
		return { success: true };
	}
};
