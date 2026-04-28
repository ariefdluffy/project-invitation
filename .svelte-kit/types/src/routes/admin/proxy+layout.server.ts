// @ts-nocheck
import { getAllInvitations, getTemplates } from '$lib/server/invitations';
import { getAllUsers } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';

export const load = async () => {
	const [invitations, users, templates, appName] = await Promise.all([
		getAllInvitations(),
		getAllUsers(),
		getTemplates(),
		getSetting('app_name').then(v => v || 'Wedding.id')
	]);

	return { invitations, users, templates, appName };
};
;null as any as LayoutServerLoad;