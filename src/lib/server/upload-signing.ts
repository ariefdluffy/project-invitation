import crypto from 'crypto';
import path from 'path';
import { env } from '$env/dynamic/private';

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24; // 24 hours

function getSecret(): string {
	return env.UPLOADS_SIGNING_SECRET || '';
}

function signPath(relativePath: string, exp: number): string {
	const secret = getSecret();
	return crypto
		.createHmac('sha256', secret)
		.update(`${relativePath}:${exp}`)
		.digest('hex');
}

export function signUploadsUrl(url: string, expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS): string {
	if (!url || !url.startsWith('/uploads/')) return url;
	if (url.includes('sig=')) return url;

	const secret = getSecret();
	if (!secret) return url;

	const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
	const rawPath = url.replace(/^\/uploads\//, '').split('?')[0];
	const relativePath = path.posix.normalize(rawPath).replace(/^([.][/])+/, '');
	const sig = signPath(relativePath, exp);
	const joiner = url.includes('?') ? '&' : '?';

	return `${url}${joiner}exp=${exp}&sig=${sig}`;
}

export function signUploadsList(value: string, expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS): string {
	if (!value) return value;

	const parts = value
		.split(/[\n,]+/)
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length === 0) return value;

	return parts.map((part) => signUploadsUrl(part, expiresInSeconds)).join('\n');
}

export function validateUploadsSignature(relativePath: string, exp: number, sig: string): boolean {
	const secret = getSecret();
	if (!secret || !exp || !sig) return false;

	const now = Math.floor(Date.now() / 1000);
	if (exp < now) return false;

	const expected = signPath(relativePath, exp);
	const expectedBuf = Buffer.from(expected);
	const sigBuf = Buffer.from(sig);
	if (expectedBuf.length !== sigBuf.length) return false;

	return crypto.timingSafeEqual(expectedBuf, sigBuf);
}
