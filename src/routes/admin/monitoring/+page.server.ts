import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { countAuditLogs } from '$lib/server/audit-log';
import { getAllUsers } from '$lib/server/users';
import { getAllInvitations } from '$lib/server/invitations';
import { getTemplates } from '$lib/server/invitations';
import { getPromoCodes } from '$lib/server/promo-codes';
import { getSetting } from '$lib/server/settings';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const db = await getDb();

	const [users, invitations, templates, promos, premiumPriceSetting, [userCount], [paidUsers], [trialUsers], [viewCount], auditCount] = await Promise.all([
		getAllUsers(),
		getAllInvitations(),
		getTemplates(),
		getPromoCodes(),
		getSetting('premium_price'),
		db.execute('SELECT COUNT(*) as count FROM users'),
		db.execute("SELECT COUNT(*) as count FROM users WHERE payment_status = 'paid'"),
		db.execute('SELECT COUNT(*) as count FROM users WHERE trial_ends_at > NOW()'),
		db.execute('SELECT COUNT(*) as count FROM page_views'),
		countAuditLogs()
	]);

	const totalUsers = (userCount as any[])[0].count;
	const totalPaidUsers = (paidUsers as any[])[0].count;
	const totalTrialUsers = (trialUsers as any[])[0].count;
	const totalPageViews = (viewCount as any[])[0].count;

	// Calculate engagement rate
	const totalInvitations = invitations.length;
	const activeInvitations = invitations.filter(inv => inv.is_published === 1).length;

	const premiumPrice = parseInt(premiumPriceSetting || '149000');

	return {
		monitoring: {
			users: {
				total: totalUsers,
				paid: totalPaidUsers,
				onTrial: totalTrialUsers,
				free: totalUsers - totalPaidUsers - totalTrialUsers
			},
			pageViews: totalPageViews,
			auditLogs: auditCount,
			invitations: {
				total: totalInvitations,
				active: activeInvitations,
				draft: totalInvitations - activeInvitations
			},
			templates: templates.length,
			promoCodes: {
				total: promos.length,
				active: promos.filter(p => p.is_active === 1).length
			},
			// Additional metrics
			revenue: totalPaidUsers * premiumPrice, // Estimated revenue
			premiumPrice,
			engagementRate: totalInvitations > 0 ? Math.round((activeInvitations / totalInvitations) * 100) : 0
		}
	};
};
