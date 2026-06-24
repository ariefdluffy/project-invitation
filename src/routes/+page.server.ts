import type { PageServerLoad } from './$types';
import { getTemplates } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';

export const load: PageServerLoad = async () => {
	const [templates, premiumPrice, addonGuestPrice, addonGuestQuantity] =
		await Promise.all([
			getTemplates(),
			getSetting('premium_price'),
			getSetting('addon_guest_price'),
			getSetting('addon_guest_quantity')
		]);

	return {
		templates,
		premiumPrice,
		addonGuestPrice,
		addonGuestQuantity
	};
};
