import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getUserByEmail, saveResetToken } from '$lib/server/users';
import { sendPasswordResetEmail } from '$lib/server/email';
import { getSetting } from '$lib/server/settings';
import { SECRET_KEY } from '$env/static/private';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

export const load: PageServerLoad = async () => {
	const turnstileSiteKey = await getSetting('turnstile_site_key');
	return { turnstileSiteKey: turnstileSiteKey || '1x00000000000000000000AA' };
};

export const actions: Actions = {
	default: async ({ request, getClientAddress, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const turnstileResponse = formData.get('cf-turnstile-response') as string;

		if (!email) {
			return fail(400, { error: 'Email harus diisi' });
		}

		// Rate limiting by IP
		const clientIp = getClientAddress();
		const rlResult = checkRateLimit(ipKey(clientIp, 'forgot-password'), {
			maxRequests: 3,
			windowMs: 60 * 1000
		});
		if (!rlResult.allowed) {
			return fail(429, {
				error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.'
			});
		}

		// Verify Turnstile
		if (!turnstileResponse) {
			return fail(400, { error: 'Security challenge (Turnstile) is required' });
		}

		try {
			const params = new URLSearchParams({
				secret: SECRET_KEY,
				response: turnstileResponse
			});
			const verifyRes = await fetch(
				'https://challenges.cloudflare.com/turnstile/v0/siteverify',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: params.toString()
				}
			);
			const verifyData = await verifyRes.json();
			if (!verifyData.success) {
				return fail(400, { error: 'Gagal memverifikasi bahwa Anda bukan robot.' });
			}
		} catch {
			return fail(500, { error: 'Terjadi kesalahan sistem verifikasi.' });
		}

		// Always return success to prevent email enumeration
		const user = await getUserByEmail(email);
		if (!user) {
			return { success: true, message: 'Jika email terdaftar, link reset password akan dikirim.' };
		}

		// Generate reset token (random bytes, hashed before stored)
		const rawToken = crypto.randomBytes(32).toString('hex');
		const hashedToken = bcryptjs.hashSync(rawToken, 10);
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

		await saveResetToken(user.id, hashedToken, expiresAt);

		// Send email (async - don't block response)
		const appName = (await getSetting('app_name')) || 'Wedding.id';
		const origin = url.origin;
		const resetLink = `${origin}/reset-password/${rawToken}?email=${encodeURIComponent(email)}`;

		sendPasswordResetEmail(email, resetLink, appName).catch((err) => {
			console.error('[ForgotPassword] Failed to send email:', err);
		});

		return { success: true, message: 'Jika email terdaftar, link reset password akan dikirim.' };
	}
};
