import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return { revenue: null, monthlyData: [], byType: [], recentTransactions: [] };
	}

	const db = await getDb();

	const [[totalRows], [successRows], [monthlyRows], [typeRows], [recentRows]] = await Promise.all([
		db.execute("SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as totalRevenue FROM payment_transactions WHERE status = 'success'"),
		db.execute("SELECT COUNT(*) as successCount, COUNT(CASE WHEN status IN ('failed','cancelled','pending') THEN 1 END) as failCount FROM payment_transactions"),
		db.execute(`
			SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
			       COUNT(*) as count,
			       COALESCE(SUM(amount), 0) as total
			FROM payment_transactions
			WHERE status = 'success' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
			GROUP BY month ORDER BY month ASC
		`),
		db.execute(`
			SELECT type, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
			FROM payment_transactions WHERE status = 'success'
			GROUP BY type
		`),
		db.execute(`
			SELECT pt.id, pt.order_id, pt.type, pt.amount, pt.status, pt.created_at, u.email
			FROM payment_transactions pt
			JOIN users u ON pt.user_id = u.id
			ORDER BY pt.created_at DESC LIMIT 10
		`)
	]);

	const total = totalRows as any[];
	const success = successRows as any[];
	const monthly = monthlyRows as any[];
	const byType = typeRows as any[];
	const recent = recentRows as any[];

	const totalTransactions = total[0]?.total || 0;
	const totalRevenue = total[0]?.totalRevenue || 0;
	const successCount = success[0]?.successCount || 0;
	const failCount = success[0]?.failCount || 0;

	return {
		revenue: { totalRevenue, totalTransactions, successCount, failCount },
		monthlyData: monthly,
		byType,
		recentTransactions: recent
	};
};
