import type { RequestHandler } from './$types';

/**
 * Dynamic robots.txt generator.
 *
 * Disallows admin/dashboard/api/uploads paths from crawlers and points to the
 * sitemap. Public template demos and invitation pages are crawlable so they
 * can be discovered.
 */
export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const body = [
		'User-agent: *',
		'Disallow: /admin',
		'Disallow: /admin/',
		'Disallow: /dashboard',
		'Disallow: /dashboard/',
		'Disallow: /api/',
		'Disallow: /uploads/',
		'Disallow: /login',
		'Disallow: /register',
		'Disallow: /forgot-password',
		'Disallow: /reset-password',
		'Disallow: /verify-email',
		'Disallow: /logout',
		'Allow: /',
		'',
		`Sitemap: ${origin}/sitemap.xml`,
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
