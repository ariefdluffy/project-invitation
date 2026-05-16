import type { PageServerLoad, Actions } from './$types';
import { getSetting } from '$lib/server/settings';
import { hasActiveAccess } from '$lib/server/users';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const trialActive = user?.trial_ends_at ? new Date(user.trial_ends_at) > new Date() : false;

	const [premiumPrice, addonGuestPrice, addonGuestQuantity] = await Promise.all([
		getSetting('premium_price'),
		getSetting('addon_guest_price'),
		getSetting('addon_guest_quantity')
	]);

	return {
		user,
		premiumPrice: premiumPrice || '39000',
		addonGuestPrice: addonGuestPrice || '19000',
		addonGuestQuantity: addonGuestQuantity || '50',
		trialActive,
		trialEndsAt: user?.trial_ends_at || null,
		hasActiveAccess: user ? hasActiveAccess(user) : false
	};
};

export const actions: Actions = {};
