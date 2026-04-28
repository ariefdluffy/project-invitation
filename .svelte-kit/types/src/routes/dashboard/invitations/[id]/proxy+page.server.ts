// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getInvitationById, updateInvitation, getGuestsByInvitation, getWishesByInvitation, addGuest, deleteGuest, deleteInvitation, getTemplates } from '$lib/server/invitations';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
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

	return { invitation, guests, wishes, templates };
};

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const actions = {
	update: async ({ request, params, locals }: import('./$types').RequestEvent) => {
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

		// Ensure upload directory exists
		const uploadDir = join(process.cwd(), 'static', 'uploads');
		if (!existsSync(uploadDir)) {
			mkdirSync(uploadDir, { recursive: true });
		}

		for (const [key, value] of formData.entries()) {
			if (key === '_action' || key === 'template_id') continue;

			// Handle File Uploads
			if (value instanceof File && value.size > 0) {
				const ext = value.name.split('.').pop();
				const fileName = `${params.id}-${key}-${Date.now()}.${ext}`;
				const filePath = join(uploadDir, fileName);
				
				const buffer = Buffer.from(await value.arrayBuffer());
				writeFileSync(filePath, buffer);
				
				data[key] = `/uploads/${fileName}`;
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

	publish: async ({ params, locals }: import('./$types').RequestEvent) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		await updateInvitation(params.id, { is_published: 1 } as any);
		return { success: true, message: 'Undangan berhasil dipublikasikan' };
	},

	unpublish: async ({ params, locals }: import('./$types').RequestEvent) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || (invitation.user_id !== locals.user!.id && locals.user!.role !== 'admin')) {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		await updateInvitation(params.id, { is_published: 0 } as any);
		return { success: true, message: 'Undangan berhasil di-unpublish' };
	},

	addGuest: async ({ request, params }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const name = formData.get('guest_name') as string;
		if (!name) return fail(400, { error: 'Nama tamu harus diisi' });

		await addGuest(params.id, name);
		return { success: true, message: 'Tamu berhasil ditambahkan' };
	},

	deleteGuest: async ({ request }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const guestId = formData.get('guest_id') as string;
		await deleteGuest(guestId);
		return { success: true, message: 'Tamu berhasil dihapus' };
	},

	delete: async ({ params }: import('./$types').RequestEvent) => {
		await deleteInvitation(params.id);
		throw redirect(303, '/dashboard/invitations');
	}
};
;null as any as Actions;