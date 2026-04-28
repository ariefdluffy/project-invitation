import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies }) => {
		// Delete session cookie with same options as set
		cookies.delete('session', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false // must match the set options
		});
		cookies.set('flash', JSON.stringify({ id: crypto.randomUUID(), type: 'success', message: 'Logout berhasil.' }), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		});
		throw redirect(303, '/');
	}
};
