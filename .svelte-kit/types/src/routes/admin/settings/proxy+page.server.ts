// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { getAllSettings, updateSetting } from '$lib/server/settings';
import { fail } from '@sveltejs/kit';

/** Hanya field form yang boleh ditulis ke tabel settings (hindari key asing / submit noise). */
const ALLOWED_SETTING_KEYS = new Set([
	'premium_price',
	'addon_guest_price',
	'addon_guest_quantity',
	'midtrans_server_key',
	'midtrans_client_key',
	'midtrans_is_production',
	'app_name',
	'payment_instructions',
	'default_music_url',
	'template_expansion_price',
	'template_expansion_quantity'
]);

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return { settings: {} };
	}
	const settings = await getAllSettings();
	return { settings };
};

export const actions = {
	update: async ({ request, locals }: import('./$types').RequestEvent) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		
		try {
			for (const [key, value] of formData.entries()) {
				if (typeof value !== 'string' || !ALLOWED_SETTING_KEYS.has(key)) continue;
				const trimmed = value.trim();
				/* Jangan timpa kunci Midtrans dengan string kosong (input password kosong saat simpan pengaturan lain). */
				if (
					(key === 'midtrans_server_key' || key === 'midtrans_client_key') &&
					trimmed === ''
				) {
					continue;
				}
				await updateSetting(key, trimmed);
			}
			return { success: true, message: 'Pengaturan berhasil diperbarui' };
		} catch (err) {
			console.error('[admin/settings] update', err);
			return fail(400, { error: 'Gagal memperbarui pengaturan' });
		}
	}
};
;null as any as Actions;