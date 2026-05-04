import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/users';
import { SECRET_KEY } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
        const turnstileResponse = formData.get('cf-turnstile-response') as string;

		if (!username || !email || !password) {
			return fail(400, { error: 'Semua field harus diisi', username, email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password minimal 6 karakter', username, email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Password tidak cocok', username, email });
		}

        // Verify Turnstile
        if (!turnstileResponse) {
            return fail(400, { error: 'Security challenge (Turnstile) is required', username, email });
        }

        try {
            const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=${SECRET_KEY}&response=${turnstileResponse}`
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return fail(400, { error: 'Gagal memverifikasi bahwa Anda bukan robot.', username, email });
            }
        } catch (err) {
            return fail(500, { error: 'Terjadi kesalahan sistem verifikasi.', username, email });
        }

		try {
			const user = await createUser(username, email, password);
			cookies.set('session', JSON.stringify({ userId: user.id }), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7
			});
			throw redirect(303, '/dashboard');
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) throw err;
			return fail(400, { error: 'Username atau email sudah terdaftar', username, email });
		}
	}
};
