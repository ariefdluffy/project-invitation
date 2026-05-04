import type { PageServerLoad, Actions } from './$types';
import { getInvitationBySlug, getTemplateById, addWish, getWishesByInvitation } from '$lib/server/invitations';
import { signUploadsList, signUploadsUrl } from '$lib/server/upload-signing';

export const load: PageServerLoad = async ({ params, url }) => {
	const { slug } = params;
	const invitation = await getInvitationBySlug(slug);

	if (!invitation || !invitation.id) {
		return {
			status: 404,
			error: new Error('Undangan tidak ditemukan'),
		};
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
	wish: async ({ request, params }) => {
		const data = await request.formData();
		const guestName = data.get('guest_name') as string;
		const isAttending = data.get('is_attending') as string; // 'hadir' or 'tidak_hadir'
		const message = data.get('message') as string;

		if (!guestName || !isAttending || message === null) {
			return { error: 'Data form tidak lengkap' };
		}

		try {
			const invitation = await getInvitationBySlug(params.slug);
			if (!invitation) {
				return { error: 'Undangan tidak ditemukan' };
			}
			await addWish(invitation.id, guestName, message, isAttending === 'hadir' ? 'hadir' : 'tidak_hadir');
			return { success: true };
		} catch (err) {
			console.error(err);
			return { error: 'Gagal menyimpan ucapan' };
		}
	}
};