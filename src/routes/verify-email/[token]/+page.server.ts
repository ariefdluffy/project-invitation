import type { PageServerLoad } from './$types';
import { verifyEmail } from '$lib/server/users';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	if (!token) {
		throw redirect(303, '/login');
	}

	const result = await verifyEmail(token);

	if (!result.success) {
		return {
			success: false,
			error: result.error || 'Token tidak valid'
		};
	}

	return {
		success: true
	};
};
