import type { PageServerLoad } from './$types';
import { getTemplates } from '$lib/server/invitations';

export const load: PageServerLoad = async () => {
	const templates = await getTemplates();
	return { templates };
};
