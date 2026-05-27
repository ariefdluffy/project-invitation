import type { LayoutServerLoad } from './$types';
import { getSetting } from '$lib/server/settings';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const [appName, turnstileSiteKeyDb] = await Promise.all([
		getSetting('app_name'),
		getSetting('turnstile_site_key')
	]);

	// Prioritas: env SITE_KEY > DB setting > Cloudflare test key
	// SITE_KEY di .env harus selalu sinkron dengan SECRET_KEY
	const turnstileSiteKey =
		env.SITE_KEY?.trim() ||
		(turnstileSiteKeyDb !== '1x00000000000000000000AA' ? turnstileSiteKeyDb : null) ||
		'1x00000000000000000000AA';

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
		appName: appName || 'Wedding.id',
		turnstileSiteKey,
		flash
	};
};
