import { getAllInvitations, getTemplates } from '$lib/server/invitations';
import { getAllUsers } from '$lib/server/users';
import { getSetting } from '$lib/server/settings';
import { getDb } from '$lib/server/db';
import { countAuditLogs } from '$lib/server/audit-log';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const db = await getDb();

	const [invitations, users, templates, appName, [userCount], [paidUsers], [trialUsers], [viewCount]] = await Promise.all([
		getAllInvitations(),
		getAllUsers(),
		getTemplates(),
		getSetting('app_name').then(v => v || 'Wedding.id'),
		db.execute('SELECT COUNT(*) as count FROM users'),
		db.execute("SELECT COUNT(*) as count FROM users WHERE payment_status = 'paid'"),
		db.execute('SELECT COUNT(*) as count FROM users WHERE trial_ends_at > NOW()'),
		db.execute('SELECT COUNT(*) as count FROM page_views')
	]);

	const auditCount = await countAuditLogs();

	return {
		invitations,
		users,
		templates,
		appName,
		monitoring: {
			users: {
				total: (userCount as any[])[0].count,
				paid: (paidUsers as any[])[0].count,
				onTrial: (trialUsers as any[])[0].count
			},
			totalPageViews: (viewCount as any[])[0].count,
			totalAuditLogs: auditCount
		}
	};
};
