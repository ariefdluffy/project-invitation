import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAuditLogs, countAuditLogs } from '$lib/server/audit-log';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 50;
	const offset = (page - 1) * limit;
	const search = url.searchParams.get('search') || '';
	const actionFilter = url.searchParams.get('action') || '';

	const logs = await getAuditLogs(limit, offset);
	const totalLogs = await countAuditLogs();
	const totalPages = Math.ceil(totalLogs / limit);

	return {
		logs,
		page,
		limit,
		totalLogs,
		totalPages,
		search,
		actionFilter
	};
};
