import crypto from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

export function generateRandomPassword(length: number = 10): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
	let password = '';
	const randomBytes = crypto.randomBytes(length);

	for (let i = 0; i < length; i++) {
		password += chars[randomBytes[i] % chars.length];
	}

	return password;
}

/**
 * Get real client IP address
 * Handles proxies/load balancers by checking X-Forwarded-For and X-Real-IP headers
 */
export function getClientIp(request: RequestEvent | Request): string {
	let headers: Headers;

	if (request instanceof Request) {
		headers = request.headers;
	} else {
		headers = request.request.headers;
	}

	// Check X-Forwarded-For header (common for proxies/load balancers)
	const forwardedFor = headers.get('x-forwarded-for');
	if (forwardedFor) {
		// X-Forwarded-For can contain multiple IPs, take the first one (original client)
		const ips = forwardedFor.split(',').map(ip => ip.trim());
		return ips[0];
	}

	// Check X-Real-IP header (set by nginx)
	const realIp = headers.get('x-real-ip');
	if (realIp) {
		return realIp.trim();
	}

	// Fallback - return localhost or unknown
	return '127.0.0.1';
}
