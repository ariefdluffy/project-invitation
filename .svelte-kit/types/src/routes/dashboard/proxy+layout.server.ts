// @ts-nocheck
import { getInvitationsByUser } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const invitations = await getInvitationsByUser(locals.user!.id);
	const appName = await getSetting('app_name') || 'Wedding.id';
	return {
		user: locals.user!,
		invitations,
		appName
	};
};
