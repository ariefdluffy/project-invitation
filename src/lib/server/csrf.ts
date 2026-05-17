/**
 * CSRF protection (double-submit cookie + synchronizer token).
 *
 * SvelteKit already enforces an Origin/Host check on form actions, which
 * defeats most cross-site form submissions. We layer a token-based check on
 * top to harden against:
 *  - Subdomain takeover scenarios where Origin is partially trusted
 *  - Mistakes that disable the built-in origin check
 *  - JSON/POST endpoints that bypass form-action behavior
 *
 * Strategy: HMAC-signed token bound to the session cookie value.
 *  - Token = base64(random) + "." + hex(hmac(secret, sessionCookie + "." + random))
 *  - Stored in cookie `csrf` (double-submit) AND must be sent as form field
 *    `csrf_token` or header `x-csrf-token`.
 *  - Verifies signature is bound to the active session cookie, so a stolen
 *    csrf cookie alone is not enough.
 */

import crypto from 'crypto';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const CSRF_COOKIE = 'csrf';
const CSRF_HEADER = 'x-csrf-token';
const CSRF_FIELD = 'csrf_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

function getSecret(): string {
	return env.SESSION_SECRET || env.CSRF_SECRET || '';
}

function sign(message: string): string {
	return crypto.createHmac('sha256', getSecret()).update(message).digest('hex');
}

/**
 * Generate a CSRF token bound to the current session cookie value (or a stable
 * fallback for unauthenticated browsing).
 */
export function generateCsrfToken(sessionCookieValue: string | undefined): string {
	const random = crypto.randomBytes(16).toString('base64url');
	const bind = sessionCookieValue || 'anon';
	const sig = sign(`${bind}.${random}`);
	return `${random}.${sig}`;
}

/**
 * Validate a token against the current session cookie. Token must match the
 * signature and not be tampered with. Constant-time compare.
 */
export function verifyCsrfToken(token: string, sessionCookieValue: string | undefined): boolean {
	if (!token || typeof token !== 'string') return false;
	const parts = token.split('.');
	if (parts.length !== 2) return false;
	const [random, sig] = parts;
	const bind = sessionCookieValue || 'anon';
	const expected = sign(`${bind}.${random}`);
	try {
		const a = Buffer.from(expected);
		const b = Buffer.from(sig);
		if (a.length !== b.length) return false;
		return crypto.timingSafeEqual(a, b);
	} catch {
		return false;
	}
}

/**
 * Ensure a CSRF cookie exists. Returns the active token. Call from `+layout.server.ts`
 * or page load functions for HTML pages that render forms.
 */
export function ensureCsrfCookie(cookies: Cookies, sessionCookieValue?: string): string {
	const existing = cookies.get(CSRF_COOKIE);
	if (existing && verifyCsrfToken(existing, sessionCookieValue)) {
		return existing;
	}
	const token = generateCsrfToken(sessionCookieValue);
	cookies.set(CSRF_COOKIE, token, {
		path: '/',
		httpOnly: false, // must be readable by client JS to be echoed back
		sameSite: 'lax',
		secure: !dev,
		maxAge: TOKEN_TTL_SECONDS
	});
	return token;
}

/**
 * Validate CSRF token from the current request. Reads from form data first,
 * falls back to header. Returns true if valid.
 */
export async function validateCsrfFromRequest(request: Request, cookies: Cookies): Promise<boolean> {
	const sessionCookieValue = cookies.get('session');
	const csrfCookieValue = cookies.get(CSRF_COOKIE);
	if (!csrfCookieValue) return false;
	if (!verifyCsrfToken(csrfCookieValue, sessionCookieValue)) return false;

	// Try header first (cheap)
	const headerToken = request.headers.get(CSRF_HEADER);
	if (headerToken && headerToken === csrfCookieValue) {
		return true;
	}

	// Fallback: parse form body (only if content-type allows)
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
		// Note: caller is expected to have already-cloned request if it needs the body.
		try {
			const cloned = request.clone();
			const data = await cloned.formData();
			const formToken = data.get(CSRF_FIELD);
			if (typeof formToken === 'string' && formToken === csrfCookieValue) {
				return true;
			}
		} catch {
			return false;
		}
	}

	return false;
}

export const CSRF_FIELD_NAME = CSRF_FIELD;
export const CSRF_HEADER_NAME = CSRF_HEADER;
export const CSRF_COOKIE_NAME = CSRF_COOKIE;
