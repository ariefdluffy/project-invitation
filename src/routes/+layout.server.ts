import type { LayoutServerLoad } from './$types';
import { getSetting } from '$lib/server/settings';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const appName = await getSetting('app_name') || 'Wedding.id';
	const flashCookie = cookies.get('flash');
	let flash: { id?: string; type?: string; message?: string } | null = null;
	if (flashCookie) {
		try {
			flash = JSON.parse(flashCookie) as { id?: string; type?: string; message?: string };
		} catch {
			flash = null;
		}
		cookies.delete('flash', { path: '/' });
	}
	return {
		user: locals.user || null,
		appName,
		flash
	};
};
