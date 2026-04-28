import { getSetting } from '$lib/server/settings';

export const load: LayoutServerLoad = async ({ locals }) => {
	const appName = await getSetting('app_name') || 'Wedding.id';
	return {
		user: locals.user || null,
		appName
	};
};
