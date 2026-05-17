import type { PageServerLoad, Actions } from './$types';
import { getTemplates, createInvitation, getInvitationsByUser } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';
import { hasActiveAccess } from '$lib/server/users';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user has access (paid or trial)
	if (!hasActiveAccess(locals.user!)) {
		throw redirect(303, '/dashboard/billing');
	}

	// Check invitation limit
	const userInvitations = await getInvitationsByUser(locals.user!.id);
	if (locals.user?.role !== 'admin' && userInvitations.length >= (locals.user?.invitation_limit || 1)) {
		throw redirect(303, '/dashboard/invitations?error=limit_reached');
	}

	const templates = await getTemplates();
	return { templates };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Check access again in action
		if (!hasActiveAccess(locals.user!)) {
			return fail(403, { error: 'Anda belum memiliki akses untuk membuat undangan. Silakan lakukan pembayaran atau aktifkan trial.' });
		}

		// Check invitation limit again
		const userInvitations = await getInvitationsByUser(locals.user!.id);
		if (locals.user?.role !== 'admin' && userInvitations.length >= (locals.user?.invitation_limit || 1)) {
			return fail(403, { error: `Anda telah mencapai batas maksimal membuat undangan (${locals.user?.invitation_limit}).` });
		}
		const formData = await request.formData();
		const templateId = formData.get('template_id') as string;
		const groomName = formData.get('groom_name') as string;
		let brideName = formData.get('bride_name') as string;
		const slug = formData.get('slug') as string;

		const templates = await getTemplates();
		const template = templates.find((t) => t.id === templateId);
		const category = (template?.category || 'wedding').toLowerCase();
		const isSingleNameCategory = ['formal', 'corporate', 'general'].includes(category);
		if (isSingleNameCategory && !brideName) brideName = groomName;

		if (!templateId || !groomName || !slug || (!brideName && !isSingleNameCategory)) {
			return fail(400, { error: 'Semua field wajib harus diisi' });
		}

		// Validate slug
		const slugRegex = /^[a-z0-9-]+$/;
		if (!slugRegex.test(slug)) {
			return fail(400, { error: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung' });
		}

		const defaultMusic = await getSetting('default_music_url') || '';
		const templateExists = Boolean(template);
		if (!templateExists) {
			return fail(400, { error: 'Template tidak valid atau tidak ditemukan.' });
		}

		try {
			const invitation = await createInvitation({
				user_id: locals.user!.id,
				template_id: templateId,
				slug,
				groom_name: groomName,
				groom_full_name: formData.get('groom_full_name') as string || '',
				groom_parents: formData.get('groom_parents') as string || '',
				groom_instagram: formData.get('groom_instagram') as string || '',
				bride_name: brideName,
				bride_full_name: formData.get('bride_full_name') as string || '',
				bride_parents: formData.get('bride_parents') as string || '',
				bride_instagram: formData.get('bride_instagram') as string || '',
				quote: formData.get('quote') as string || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
				quote_source: formData.get('quote_source') as string || 'QS Ar-Rum : 21',
				akad_date: formData.get('akad_date') as string || '',
				akad_time: formData.get('akad_time') as string || '',
				resepsi_date: formData.get('resepsi_date') as string || '',
				resepsi_time: formData.get('resepsi_time') as string || '',
				venue_name: formData.get('venue_name') as string || '',
				venue_address: formData.get('venue_address') as string || '',
				venue_map_url: formData.get('venue_map_url') as string || '',
				love_story: formData.get('love_story') as string || '',
				bank_accounts: formData.get('bank_accounts') as string || '[]',
				dress_code_colors: formData.get('dress_code_colors') as string || '[]',
				music_url: formData.get('music_url') as string || defaultMusic,
			});

			throw redirect(303, `/dashboard/invitations/${invitation.id}`);
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) throw err;
			return fail(400, { error: 'Gagal membuat undangan. Slug mungkin sudah digunakan.' });
		}
	}
};
