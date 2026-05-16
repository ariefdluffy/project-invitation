import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { countAuditLogs } from '$lib/server/audit-log';

export const GET: RequestHandler = async ({ locals }) => {
	// Only admin can view monitoring
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const db = await getDb();

	// User stats
	const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
	const [paidUsers] = await db.execute("SELECT COUNT(*) as count FROM users WHERE payment_status = 'paid'");
	const [trialUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE trial_ends_at > NOW()');

	// Invitation stats
	const [invCount] = await db.execute('SELECT COUNT(*) as count FROM invitations');
	const [pubCount] = await db.execute('SELECT COUNT(*) as count FROM invitations WHERE is_published = 1');

	// Payment stats
	const [txCount] = await db.execute('SELECT COUNT(*) as count FROM payment_transactions');
	const [txSuccess] = await db.execute("SELECT COUNT(*) as count FROM payment_transactions WHERE status = 'success'");
	const [txRevenue] = await db.execute("SELECT SUM(amount) as total FROM payment_transactions WHERE status = 'success'");

	// View stats
	const [viewCount] = await db.execute('SELECT COUNT(*) as count FROM page_views');

	// Audit count
	const auditCount = await countAuditLogs();

	return json({
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		users: {
			total: (userCount as any[])[0].count,
			paid: (paidUsers as any[])[0].count,
			onTrial: (trialUsers as any[])[0].count
		},
		invitations: {
			total: (invCount as any[])[0].count,
			published: (pubCount as any[])[0].count
		},
		payments: {
			total: (txCount as any[])[0].count,
			successful: (txSuccess as any[])[0].count,
			revenue: (txRevenue as any[])[0].total || 0
		},
		analytics: {
			totalPageViews: (viewCount as any[])[0].count,
			auditLogEntries: auditCount
		}
	});
};
