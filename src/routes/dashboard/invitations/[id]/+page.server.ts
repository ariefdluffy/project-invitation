import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getInvitationById, updateInvitation, getGuestsByInvitation, getWishesByInvitation, addGuest, deleteGuest, deleteInvitation, getTemplates } from '$lib/server/invitations';
import { isAllowedImageType } from '$lib/server/magic-bytes';
import { getInvitationStats, getUserAnalytics } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ params, locals }) => {
	const invitation = await getInvitationById(params.id);
	if (!invitation) throw error(404, 'Undangan tidak ditemukan');
	if (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin') {
		throw error(403, 'Tidak memiliki akses');
	}

	const [guests, wishes, templates] = await Promise.all([
		getGuestsByInvitation(params.id),
		getWishesByInvitation(params.id),
		getTemplates()
	]);

	const stats = invitation ? await getInvitationStats(invitation.id) : null;
	const userStats = locals.user ? await getUserAnalytics(locals.user.id) : null;

	return { invitation, guests, wishes, templates, stats, userStats };
};

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		const data: Record<string, any> = {};

        // AMBIL template_id secara eksplisit
        const manualTemplateId = formData.get('template_id');
        if (manualTemplateId) {
            data.template_id = manualTemplateId;
        }

		// Ensure user-specific upload directory exists (consistent with media page)
			const userUploadDir = join(process.cwd(), 'static', 'uploads', locals.user!.id);
			if (!existsSync(userUploadDir)) {
				mkdirSync(userUploadDir, { recursive: true });
			}

		for (const [key, value] of formData.entries()) {
			if (key === '_action' || key === 'template_id') continue;

			// Handle File Uploads — store in user-specific dir (consistent with media page)
			if (value instanceof File && value.size > 0) {
				const maxFileSize = Number(env.MAX_FILE_SIZE || 1048576);
				if (value.size > maxFileSize) {
					return fail(400, { error: 'Ukuran file melebihi batas 1MB' });
				}

				// Validate by magic bytes
				const fileBuffer = Buffer.from(await value.arrayBuffer());
				const detectedType = isAllowedImageType(new Uint8Array(fileBuffer));
				if (!detectedType) {
					return fail(400, { error: 'Hanya file JPG dan PNG yang diperbolehkan' });
				}

				// Gunakan ekstensi dari detected type, bukan dari nama file (lebih aman)
				const ext = detectedType === 'image/jpeg' ? 'jpg' : 'png';
				const fileName = `${params.id}-${key}-${Date.now()}.${ext}`;
				const filePath = join(userUploadDir, fileName);

				writeFileSync(filePath, fileBuffer);

				data[key] = `/uploads/${locals.user!.id}/${fileName}`;
			} else if (key === 'custom_content') {
                data[key] = value;
            } else if (!(value instanceof File)) {
				// Save all other string values
				data[key] = value === '' ? null : value;
			}
		}

		try {
			await updateInvitation(params.id, data);
			return { success: true, message: 'Undangan berhasil diperbarui' };
		} catch (e: any) {
			console.error('Update error:', e);
			return fail(500, { error: e.message || 'Gagal memperbarui undangan' });
		}
	},

	publish: async ({ params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		await updateInvitation(params.id, { is_published: 1 } as any);
		return { success: true, message: 'Undangan berhasil dipublikasikan' };
	},

	unpublish: async ({ params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		await updateInvitation(params.id, { is_published: 0 } as any);
		return { success: true, message: 'Undangan berhasil di-unpublish' };
	},

	addGuest: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const name = (formData.get('guest_name') as string || '').trim();
		if (!name) return fail(400, { error: 'Nama tamu harus diisi' });
		if (name.length > 100) return fail(400, { error: 'Nama tamu terlalu panjang (maks 100 karakter)' });

		// Verifikasi ownership
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		try {
			await addGuest(params.id, name);
			return { success: true, message: 'Tamu berhasil ditambahkan' };
		} catch (err: any) {
			return fail(400, { error: err.message || 'Gagal menambahkan tamu' });
		}
	},

	deleteGuest: async ({ request, locals }) => {
		const formData = await request.formData();
		const guestId = formData.get('guest_id') as string;
		if (!guestId) return fail(400, { error: 'ID tamu tidak valid' });

		// Verifikasi ownership: pastikan guest milik undangan yang dimiliki user
		const db = await (await import('$lib/server/db')).getDb();
		const [rows] = await db.execute(
			`SELECT g.id FROM guests g
			 JOIN invitations i ON g.invitation_id = i.id
			 WHERE g.id = ? AND (i.user_id = ? OR ? = 'admin')`,
			[guestId, locals.user!.id, locals.user!.role]
		);
		if ((rows as any[]).length === 0) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		await deleteGuest(guestId);
		return { success: true, message: 'Tamu berhasil dihapus' };
	},

	delete: async ({ params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}
		await deleteInvitation(params.id);
		throw redirect(303, '/dashboard/invitations');
	}
};
