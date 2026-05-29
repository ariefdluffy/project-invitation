import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { deleteInvitation, getInvitationById, updateInvitation } from '$lib/server/invitations';
import { logAudit } from '$lib/server/audit-log';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';
import { isAllowedImageType } from '$lib/server/magic-bytes';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const actions: Actions = {
	delete: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-inv-delete'), { maxRequests: 10, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan. Coba lagi nanti.' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID undangan tidak valid' });

		const invitation = await getInvitationById(id);
		if (!invitation) return fail(404, { error: 'Undangan tidak ditemukan' });

		try {
			await deleteInvitation(id);
			logAudit({
				action: 'invitation.delete',
				userId: locals.user.id,
				details: `Admin deleted invitation ${invitation.slug} (${invitation.bride_name} & ${invitation.groom_name})`,
				metadata: { invitationId: id, slug: invitation.slug }
			}).catch(() => {});
			return { success: true, message: 'Undangan berhasil dihapus' };
		} catch (err) {
			return fail(500, { error: 'Gagal menghapus undangan' });
		}
	},

	update: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-inv-update'), { maxRequests: 20, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan. Coba lagi nanti.' });

		const formData = await request.formData();
		const invitationId = formData.get('invitation_id') as string;
		if (!invitationId) return fail(400, { error: 'ID undangan tidak valid' });

		const invitation = await getInvitationById(invitationId);
		if (!invitation) return fail(404, { error: 'Undangan tidak ditemukan' });

		const data: Record<string, any> = {};

		// Handle file uploads for groom_photo, bride_photo, background_image
		const fileFields = ['groom_photo', 'bride_photo', 'background_image'];
		const userUploadDir = join(process.cwd(), 'static', 'uploads', invitation.user_id);
		if (!existsSync(userUploadDir)) {
			mkdirSync(userUploadDir, { recursive: true });
		}

		for (const [key, value] of formData.entries()) {
			if (key === '_action' || key === 'invitation_id') continue;

			if (fileFields.includes(key) && value instanceof File && value.size > 0) {
				const maxFileSize = Number(env.MAX_FILE_SIZE || 1048576);
				if (value.size > maxFileSize) {
					return fail(400, { error: `Ukuran file ${key} melebihi batas 1MB` });
				}

				const fileBuffer = Buffer.from(await value.arrayBuffer());
				const detectedType = isAllowedImageType(new Uint8Array(fileBuffer));
				if (!detectedType) {
					return fail(400, { error: `File ${key}: hanya JPG dan PNG yang diperbolehkan` });
				}

				const ext = detectedType === 'image/jpeg' ? 'jpg' : 'png';
				const fileName = `${uuidv4()}.${ext}`;
				const filePath = join(userUploadDir, fileName);

				writeFileSync(filePath, fileBuffer);
				data[key] = `/uploads/${invitation.user_id}/${fileName}`;
			} else if (!(value instanceof File)) {
				data[key] = value === '' ? null : value;
			}
		}

		if (Object.keys(data).length === 0) {
			return fail(400, { error: 'Tidak ada data yang dikirim' });
		}

		try {
			await updateInvitation(invitationId, data);
			logAudit({
				action: 'invitation.update',
				userId: locals.user.id,
				details: `Admin updated invitation ${invitation.slug} (${invitation.bride_name} & ${invitation.groom_name})`,
				metadata: { invitationId, slug: invitation.slug, updatedFields: Object.keys(data) }
			}).catch(() => {});
			return { success: true, message: 'Undangan berhasil diperbarui' };
		} catch (err: any) {
			console.error('Admin update invitation error:', err);
			return fail(500, { error: err.message || 'Gagal memperbarui undangan' });
		}
	},

	unpublish: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-inv-unpublish'), { maxRequests: 10, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak permintaan. Coba lagi nanti.' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID undangan tidak valid' });

		const invitation = await getInvitationById(id);
		if (!invitation) return fail(404, { error: 'Undangan tidak ditemukan' });

		try {
			await updateInvitation(id, { is_published: 0 } as any);
			logAudit({
				action: 'invitation.unpublish',
				userId: locals.user.id,
				details: `Admin unpublished invitation ${invitation.slug}`,
				metadata: { invitationId: id }
			}).catch(() => {});
			return { success: true, message: 'Undangan berhasil di-unpublish' };
		} catch (err) {
			return fail(500, { error: 'Gagal mengubah status undangan' });
		}
	}
};
