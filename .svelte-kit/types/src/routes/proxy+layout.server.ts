// @ts-nocheck
import { getSetting } from '$lib/server/settings';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const appName = await getSetting('app_name') || 'Wedding.id';
	return {
		user: locals.user || null,
		appName
	};
};
