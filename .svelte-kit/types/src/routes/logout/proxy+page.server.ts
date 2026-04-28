// @ts-nocheck
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }: import('./$types').RequestEvent) => {
		// Delete session cookie with same options as set
		cookies.delete('session', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false // must match the set options
		});
		throw redirect(303, '/');
	}
};
;null as any as Actions;