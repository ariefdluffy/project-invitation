// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getGuestStatsByUser } from '$lib/server/invitations';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const guestStats = await getGuestStatsByUser(locals.user!.id);
	
	return {
		guestStats
	};
};
