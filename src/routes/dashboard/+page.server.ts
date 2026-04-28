import type { PageServerLoad } from './$types';
import { getGuestStatsByUser } from '$lib/server/invitations';

export const load: PageServerLoad = async ({ locals }) => {
	const guestStats = await getGuestStatsByUser(locals.user!.id);
	
	return {
		guestStats
	};
};
