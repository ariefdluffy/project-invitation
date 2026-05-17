import { getInvitationsByUser } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';
import { hasActiveAccess } from '$lib/server/users';

export const load: LayoutServerLoad = async ({ locals }) => {
	const invitations = await getInvitationsByUser(locals.user!.id);
	const appName = await getSetting('app_name') || 'Wedding.id';
	return {
		user: locals.user!,
		invitations,
		appName,
		hasActiveAccess: hasActiveAccess(locals.user!)
	};
};
