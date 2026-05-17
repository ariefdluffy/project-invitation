import crypto from 'crypto';
import { env } from '$env/dynamic/private';
import { getActiveSession } from './session-store';

const SESSION_SECRET: string = env.SESSION_SECRET || '';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const SESSION_TTL_SECONDS = SESSION_MAX_AGE_SECONDS;

export interface SessionPayload {
	/** Server-side session id (FK to `sessions` table) */
	sid: string;
	/** User id (kept for backwards compat, validated via session-store) */
	userId: string;
	/** Expiry epoch seconds */
	exp: number;
}

function signPayload(payloadB64: string): string {
	return crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('hex');
}

/**
 * Build a signed session cookie string from raw values.
 * `sid` should reference an existing row in the `sessions` table.
 */
export function buildSessionToken(sid: string, userId: string): string {
	if (!SESSION_SECRET) {
		throw new Error('SESSION_SECRET env var not set. Set it in .env for secure sessions.');
	}
	const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
	const payload: SessionPayload = { sid, userId, exp };
	const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
	const signature = signPayload(payloadB64);
	return `${payloadB64}.${signature}`;
}

/**
 * Legacy helper kept for compatibility — generates a token without server-side
 * session record. Prefer `buildSessionToken` paired with `createSession`.
 *
 * @deprecated Use `createSession` + `buildSessionToken`.
 */
export function createSessionToken(userId: string): string {
	// We still produce a deterministic random sid so verifiers don't accept
	// tokens whose sessions table row is missing/revoked.
	const sid = crypto.randomBytes(16).toString('hex');
	return buildSessionToken(sid, userId);
}

/**
 * Verify and decode session token.
 * - Validates HMAC signature
 * - Validates token expiry
 * - Validates that the referenced session row is still active (non-revoked, non-expired)
 *
 * Returns null on any failure.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
	if (!SESSION_SECRET) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [payloadB64, signature] = parts;

	// Verify HMAC signature
	const expectedSig = signPayload(payloadB64);
	try {
		const a = Buffer.from(expectedSig);
		const b = Buffer.from(signature);
		if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
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

	// Cookie-side expiry
	if (payload.exp < Math.floor(Date.now() / 1000)) {
		return null;
	}

	// Server-side session check (revocation aware).
	// If the token was minted via legacy `createSessionToken` (no row in DB),
	// the lookup will fail, which is the desired behavior going forward.
	if (!payload.sid) return null;
	const record = await getActiveSession(payload.sid);
	if (!record) return null;
	if (record.user_id !== payload.userId) return null;

	return payload;
}
