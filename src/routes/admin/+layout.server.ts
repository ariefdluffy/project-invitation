import { getAllInvitations, getTemplates } from '$lib/server/invitations';
import { getAllUsers } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { getDb } from '$lib/server/db';
import { countAuditLogs } from '$lib/server/audit-log';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Fallback auth check - primary check ada di hooks.server.ts
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const db = await getDb();

	// Jalankan semua query secara paralel untuk efisiensi
	const [
		invitations,
		users,
		templates,
		appNameSetting,
		[userCountRows],
		[paidUserRows],
		[trialUserRows],
		[viewCountRows],
		auditCount
	] = await Promise.all([
		getAllInvitations(),
		getAllUsers(),
		getTemplates(),
		getSetting('app_name'),
		db.execute('SELECT COUNT(*) as count FROM users'),
		db.execute("SELECT COUNT(*) as count FROM users WHERE payment_status = 'paid'"),
		db.execute('SELECT COUNT(*) as count FROM users WHERE trial_ends_at > NOW() AND has_access = 0'),
		db.execute('SELECT COUNT(*) as count FROM page_views'),
		countAuditLogs()
	]);

	return {
		invitations,
		users,
		templates,
		appName: appNameSetting || 'Wedding.id',
		monitoring: {
			users: {
				total: (userCountRows as any[])[0].count,
				paid: (paidUserRows as any[])[0].count,
				onTrial: (trialUserRows as any[])[0].count
			},
			totalPageViews: (viewCountRows as any[])[0].count,
			totalAuditLogs: auditCount
		}
	};
};
