// @ts-nocheck
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/users';

export const actions = {
	default: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!username || !email || !password) {
			return fail(400, { error: 'Semua field harus diisi', username, email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password minimal 6 karakter', username, email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Password tidak cocok', username, email });
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
;null as any as Actions;