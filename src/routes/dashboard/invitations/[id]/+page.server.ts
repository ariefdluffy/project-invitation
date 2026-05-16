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
				if (!isAllowedImageType(new Uint8Array(fileBuffer))) {
					return fail(400, { error: 'Hanya file JPG dan PNG yang diperbolehkan' });
				}

				const ext = value.name.split('.').pop();
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

	addGuest: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('guest_name') as string;
		if (!name) return fail(400, { error: 'Nama tamu harus diisi' });

		await addGuest(params.id, name);
		return { success: true, message: 'Tamu berhasil ditambahkan' };
	},

	deleteGuest: async ({ request }) => {
		const formData = await request.formData();
		const guestId = formData.get('guest_id') as string;
		await deleteGuest(guestId);
		return { success: true, message: 'Tamu berhasil dihapus' };
	},

	delete: async ({ params }) => {
		await deleteInvitation(params.id);
		throw redirect(303, '/dashboard/invitations');
	}
};
