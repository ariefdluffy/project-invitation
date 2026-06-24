import type { PageServerLoad } from './$types';
import { getTemplates } from '$lib/server/invitations';
import { getPackages } from '$lib/server/packages';
import { getSetting } from '$lib/server/settings';

export const load: PageServerLoad = async () => {
	const [templates, packages, premiumPrice, addonGuestPrice, addonGuestQuantity] =
		await Promise.all([
			getTemplates(),
			getPackages(),
			getSetting('premium_price'),
			getSetting('addon_guest_price'),
			getSetting('addon_guest_quantity')
		]);

	return {
		templates,
		packages,
		premiumPrice: premiumPrice || '39000',
		addonGuestPrice: addonGuestPrice || '19000',
		addonGuestQuantity: addonGuestQuantity || '50'
	};
};
