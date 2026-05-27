import type { PageServerLoad } from './$types';
import { getTemplates } from '$lib/server/invitations';
import { getPackages } from '$lib/server/packages';

export const load: PageServerLoad = async () => {
	const templates = await getTemplates();
	const packages = await getPackages();
	return { templates, packages };
};
