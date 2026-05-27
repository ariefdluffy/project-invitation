import crypto from 'crypto';
import { env } from '$env/dynamic/private';

const SESSION_SECRET: string = env.SESSION_SECRET || '';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
	userId: string;
	exp: number;
}

/**
 * Create signed session token (HMAC SHA-256)
 * Format: base64(payload).hex(signature)
 */
export function createSessionToken(userId: string): string {
	if (!SESSION_SECRET) {
		throw new Error('SESSION_SECRET env var not set. Set it in .env for secure sessions.');
	}
	const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
	const payload: SessionPayload = { userId, exp };
	const payloadStr = JSON.stringify(payload);
	const payloadB64 = Buffer.from(payloadStr).toString('base64url');
	const signature = crypto
		.createHmac('sha256', SESSION_SECRET)
		.update(payloadB64)
		.digest('hex');
	return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode session token.
 * Returns null if invalid, expired, or tampered.
 */
export function verifySessionToken(token: string): SessionPayload | null {
	if (!SESSION_SECRET) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [payloadB64, signature] = parts;

	// Verify signature
	const expectedSig = crypto
		.createHmac('sha256', SESSION_SECRET)
		.update(payloadB64)
		.digest('hex');

	try {
		if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) {
			return null;
		}
	} catch {
		return null;
	}

	// Decode payload
	let payload: SessionPayload;
	try {
		const payloadStr = Buffer.from(payloadB64, 'base64url').toString();
		payload = JSON.parse(payloadStr) as SessionPayload;
	} catch {
		return null;
	}

	// Check expiry
	if (payload.exp < Math.floor(Date.now() / 1000)) {
		return null;
	}

	return payload;
}
