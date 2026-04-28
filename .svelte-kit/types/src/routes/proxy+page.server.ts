// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getTemplates } from '$lib/server/invitations';

export const load = async () => {
	const templates = await getTemplates();
	return { templates };
};
;null as any as PageServerLoad;