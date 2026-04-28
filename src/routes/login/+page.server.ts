import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/users';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email dan password harus diisi', email });
		}

		const user = await authenticateUser(email, password);
		if (!user) {
			return fail(400, { error: 'Email atau password salah', email });
		}

		// Set session cookie
		cookies.set('session', JSON.stringify({ userId: user.id }), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // false for HTTP
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// Redirect to dashboard or admin
		if (user.role === 'admin') {
			throw redirect(303, '/admin');
		}
		throw redirect(303, '/dashboard');
	}
};
