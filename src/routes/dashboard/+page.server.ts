import type { PageServerLoad } from './$types';
import { getGuestStatsByUser } from '$lib/server/invitations';
import { getUserAnalytics } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ locals }) => {
	const [guestStats, userStats] = await Promise.all([
		getGuestStatsByUser(locals.user!.id),
		getUserAnalytics(locals.user!.id)
	]);

	return {
		guestStats,
		userStats
	};
};
