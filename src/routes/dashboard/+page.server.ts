import type { PageServerLoad } from './$types';
import { getGuestStatsByUser } from '$lib/server/invitations';
import {
	getUserAnalytics,
	getRecentWishesByUser,
	getDailyViewsByUser
} from '$lib/server/analytics';
import { hasActiveAccess, isUserInTrial } from '$lib/server/users';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const [guestStats, userStats, recentWishes, dailyViews] = await Promise.all([
		getGuestStatsByUser(user.id),
		getUserAnalytics(user.id),
		getRecentWishesByUser(user.id, 5),
		getDailyViewsByUser(user.id, 14)
	]);

	const trialActive = isUserInTrial(user);
	const accountActive = hasActiveAccess(user);

	return {
		guestStats,
		userStats,
		recentWishes,
		dailyViews,
		trialActive,
		accountActive
	};
};
