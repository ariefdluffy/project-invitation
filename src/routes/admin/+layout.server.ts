import { getTemplates } from '$lib/server/invitations';
import { getSetting } from '$lib/server/settings';
import { getDb } from '$lib/server/db';
import { countAuditLogs } from '$lib/server/audit-log';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const PAGE_SIZE = 20;

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Fallback auth check - primary check ada di hooks.server.ts
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const db = await getDb();
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const offset = (page - 1) * PAGE_SIZE;

	// Jalankan semua query secara paralel untuk efisiensi
	const [
		templates,
		appNameSetting,
		[userCountRows],
		[paidUserRows],
		[trialUserRows],
		[viewCountRows],
		auditCount,
		[invitationCountRows],
		[publishedCountRows],
		[userPageRows],
		[invitationPageRows]
	] = await Promise.all([
		getTemplates(),
		getSetting('app_name'),
		db.execute('SELECT COUNT(*) as count FROM users'),
		db.execute("SELECT COUNT(*) as count FROM users WHERE payment_status = 'paid'"),
		db.execute('SELECT COUNT(*) as count FROM users WHERE trial_ends_at > NOW() AND has_access = 0'),
		db.execute('SELECT COUNT(*) as count FROM page_views'),
		countAuditLogs(),
		db.execute('SELECT COUNT(*) as count FROM invitations'),
		db.execute('SELECT COUNT(*) as count FROM invitations WHERE is_published = 1'),
		db.execute(`SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, trial_ends_at, created_at FROM users ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`),
		db.execute(`SELECT id, user_id, slug, bride_name, groom_name, is_published, akad_date, created_at FROM invitations ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`)
	]);

	const totalUsers = (userCountRows as any[])[0].count;
	const totalInvitations = (invitationCountRows as any[])[0].count;

	return {
		users: userPageRows as any[],
		invitations: invitationPageRows as any[],
		templates,
		appName: appNameSetting || 'Wedding.id',
		pagination: {
			page,
			pageSize: PAGE_SIZE,
			totalUsers,
			totalInvitations,
			totalUserPages: Math.ceil(totalUsers / PAGE_SIZE),
			totalInvitationPages: Math.ceil(totalInvitations / PAGE_SIZE)
		},
		monitoring: {
			users: {
				total: totalUsers,
				paid: (paidUserRows as any[])[0].count,
				onTrial: (trialUserRows as any[])[0].count
			},
			invitations: {
				total: totalInvitations,
				published: (publishedCountRows as any[])[0].count
			},
			totalPageViews: (viewCountRows as any[])[0].count,
			totalAuditLogs: auditCount
		}
	};
};
