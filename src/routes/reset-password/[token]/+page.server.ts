import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { verifyResetToken, updateUserPassword, clearResetToken } from '$lib/server/users';
import { validatePassword } from '$lib/server/password-policy';

export const load: PageServerLoad = async ({ params, url }) => {
	const token = params.token;
	const email = url.searchParams.get('email') || '';

	if (!token || !email) {
		return { error: 'Link reset password tidak valid.' };
	}

	return { token, email };
};

export const actions: Actions = {
	default: async ({ request, params, url }) => {
		const token = params.token;
		const email = url.searchParams.get('email') || '';

		if (!token || !email) {
			return fail(400, { error: 'Link reset password tidak valid.' });
		}

		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!password || !confirmPassword) {
			return fail(400, { error: 'Semua field harus diisi.' });
		}

		const pwCheck = validatePassword(password);
		if (!pwCheck.valid) {
			return fail(400, { error: pwCheck.error || 'Password tidak valid' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Password tidak cocok.' });
		}

		// Verify token
		const user = await verifyResetToken(email, token);
		if (!user) {
			return fail(400, { error: 'Link reset password tidak valid atau sudah kadaluarsa.' });
		}

		// Update password
		await updateUserPassword(user.id, password);
		await clearResetToken(user.id);

		throw redirect(303, '/login?reset=success');
	}
};
