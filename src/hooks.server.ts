import type { Handle } from '@sveltejs/kit';
import { seedTemplates, seedAdmin, seedSettings } from '$lib/server/invitations';
import { getUserById } from '$lib/server/users';
import { ensurePaymentTransactionsTable } from '$lib/server/payment-transactions';

let seeded = false;

export const handle: Handle = async ({ event, resolve }) => {
	// Seed database on first request
	if (event.url.searchParams.has('reseed')) {
		seeded = false;
	}

	if (!seeded) {
		console.log('[Server] Seeding database templates and settings...');
		await seedTemplates();
		await seedSettings();
		await seedAdmin();
		await ensurePaymentTransactionsTable();
		seeded = true;
	}

	// Get session from cookie
	const sessionCookie = event.cookies.get('session');
	if (sessionCookie) {
		try {
			const session = JSON.parse(sessionCookie);
			const user = await getUserById(session.userId);
			if (user) {
				event.locals.user = user;
			}
		} catch {
			// Invalid session cookie
		}
	}

	// Protect admin routes
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return new Response(null, {
				status: 302,
				headers: { location: '/login' }
			});
		}
	}

	// Protect dashboard routes  
	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) {
			return new Response(null, {
				status: 302,
				headers: { location: '/login' }
			});
		}
	}

	const response = await resolve(event);

	// Add CSP headers
	const csp = [
		"default-src 'self'",
		"script-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com 'unsafe-eval' 'unsafe-inline'",
		"script-src-elem 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com 'unsafe-eval' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
		"img-src 'self' data: blob: https://challenges.cloudflare.com https://*.cloudflare.com",
		"font-src 'self' data: https://fonts.gstatic.com",
		"connect-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com",
		"frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'self'"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);

	return response;
};
