// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { getInvitationBySlug, getTemplateById, addWish, getWishesByInvitation } from '$lib/server/invitations';

export const load = async ({ params, url }: Parameters<PageServerLoad>[0]) => {
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

	// Get guest name from query parameter ?to=
	const guestName = url.searchParams.get('to') ?? '';

	return {
		invitation,
		template,
		wishes,
		guestName, // optional
	};
};

export const actions = {
	wish: async ({ request, params }: import('./$types').RequestEvent) => {
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
};;null as any as Actions;