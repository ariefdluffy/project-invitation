import type { PageServerLoad, Actions } from './$types';
import { getInvitationBySlug, getTemplateById, addWish, getWishesByInvitation } from '$lib/server/invitations';
import { signUploadsList, signUploadsUrl } from '$lib/server/upload-signing';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const { slug } = params;
	const invitation = await getInvitationBySlug(slug);

	if (!invitation || !invitation.id) {
		return {
			status: 404,
			error: new Error('Undangan tidak ditemukan'),
		};
	}

	// Undangan yang belum dipublish hanya bisa dilihat oleh pemilik atau admin
	if (!invitation.is_published) {
		const isOwner = locals.user?.id === invitation.user_id;
		const isAdmin = locals.user?.role === 'admin';
		if (!isOwner && !isAdmin) {
			return {
				status: 404,
				error: new Error('Undangan tidak ditemukan'),
			};
		}
	}

	const template = await getTemplateById(invitation.template_id);
	const wishes = await getWishesByInvitation(invitation.id);

	const signedInvitation = {
		...invitation,
		bride_photo: signUploadsUrl(invitation.bride_photo || ''),
		groom_photo: signUploadsUrl(invitation.groom_photo || ''),
		background_image: signUploadsList(invitation.background_image || ''),
		gallery_images: signUploadsList(invitation.gallery_images || '')
	};

	// Get guest name from query parameter ?to=
	const guestName = url.searchParams.get('to') ?? '';

	return {
		invitation: signedInvitation,
		template,
		wishes,
		guestName, // optional
	};
};

export const actions: Actions = {
	wish: async ({ request, params, getClientAddress }) => {
		// Rate limit: max 5 wishes per IP per 10 menit
		const clientIp = getClientAddress();
		const rlResult = checkRateLimit(ipKey(clientIp, `wish:${params.slug}`), {
			maxRequests: 5,
			windowMs: 10 * 60 * 1000
		});
		if (!rlResult.allowed) {
			return { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' };
		}

		const data = await request.formData();
		const guestName = (data.get('guest_name') as string || '').trim();
		const isAttending = data.get('is_attending') as string;
		const message = (data.get('message') as string || '').trim();

		if (!guestName || !isAttending || !message) {
			return { error: 'Data form tidak lengkap' };
		}

		// Validasi panjang input
		if (guestName.length > 100) {
			return { error: 'Nama tamu terlalu panjang (maks 100 karakter)' };
		}
		if (message.length > 1000) {
			return { error: 'Pesan terlalu panjang (maks 1000 karakter)' };
		}
		if (!['hadir', 'tidak_hadir'].includes(isAttending)) {
			return { error: 'Status kehadiran tidak valid' };
		}

		try {
			const invitation = await getInvitationBySlug(params.slug);
			if (!invitation) {
				return { error: 'Undangan tidak ditemukan' };
			}
			await addWish(invitation.id, guestName, message, isAttending);
			return { success: true };
		} catch (err) {
			console.error(err);
			return { error: 'Gagal menyimpan ucapan' };
		}
	}
};