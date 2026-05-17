import type { PageServerLoad, Actions } from './$types';
import { getSetting } from '$lib/server/settings';
import { hasActiveAccess, activateTrial } from '$lib/server/users';
import { fail, redirect } from '@sveltejs/kit';

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

export const actions: Actions = {
	activateTrial: async ({ locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		const result = await activateTrial(locals.user.id);
		if (!result.success) {
			return fail(400, { error: result.error });
		}
		throw redirect(303, '/dashboard/billing');
	}
};
