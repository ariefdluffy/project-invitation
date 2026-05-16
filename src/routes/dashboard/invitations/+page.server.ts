import { getInvitationsByUser, duplicateInvitation } from '$lib/server/invitations';
import { hasActiveAccess } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const invitations = await getInvitationsByUser(locals.user!.id);
	const appName = await getSetting('app_name') || 'Wedding.id';
	const error = url.searchParams.get('error');

	return {
		user: locals.user!,
		invitations,
		appName,
		error,
		hasActiveAccess: hasActiveAccess(locals.user!)
	};
};

export const actions: Actions = {
	duplicate: async ({ request, locals }) => {
		if (!locals.user) return fail(401);

		const formData = await request.formData();
		const id = formData.get('id') as string;

		// Check limit before duplicating
		const existing = await getInvitationsByUser(locals.user.id);
		if (existing.length >= locals.user.invitation_limit) {
			return fail(400, { error: `Limit undangan tercapai (${locals.user.invitation_limit}).` });
		}

		try {
			const newId = await duplicateInvitation(id);
			throw redirect(303, `/dashboard/invitations/${newId}`);
		} catch (err: any) {
			if (err.status) throw err; // Re-throw redirects
			console.error('[Duplicate] Error:', err);
			return fail(500, { error: 'Gagal menduplikat undangan.' });
		}
	}
};
