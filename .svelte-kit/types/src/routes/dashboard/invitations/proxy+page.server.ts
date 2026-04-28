// @ts-nocheck
import { getInvitationsByUser, duplicateInvitation } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const invitations = await getInvitationsByUser(locals.user!.id);
	const appName = await getSetting('app_name') || 'Wedding.id';
	const error = url.searchParams.get('error');
	
	return {
		user: locals.user!,
		invitations,
		appName,
		error
	};
};

export const actions = {
	duplicate: async ({ request, locals }: import('./$types').RequestEvent) => {
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
;null as any as Actions;