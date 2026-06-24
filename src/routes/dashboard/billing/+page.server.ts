import type { PageServerLoad, Actions } from './$types';
import { getSetting } from '$lib/server/settings';
import { hasActiveAccess } from '$lib/server/users';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const trialActive = user?.trial_ends_at ? new Date(user.trial_ends_at) > new Date() : false;

	const [premiumPrice, addonGuestPrice, addonGuestQuantity, paymentInstructions] = await Promise.all([
		getSetting('premium_price'),
		getSetting('addon_guest_price'),
		getSetting('addon_guest_quantity'),
		getSetting('payment_instructions')
	]);

	return {
		user,
		premiumPrice,
		addonGuestPrice,
		addonGuestQuantity,
		paymentInstructions: paymentInstructions || '',
		trialActive,
		trialEndsAt: user?.trial_ends_at || null,
		hasActiveAccess: user ? hasActiveAccess(user) : false
	};
};

export const actions: Actions = {};
