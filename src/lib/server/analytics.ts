import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface PageView {
	id: string;
	invitation_id: string;
	guest_ip: string | null;
	user_agent: string | null;
	referrer: string | null;
	guest_name: string | null;
	created_at: string;
}

export async function trackPageView(params: {
	invitationId: string;
	ip?: string;
	userAgent?: string;
	referrer?: string;
	guestName?: string;
}): Promise<void> {
	try {
		const db = await getDb();
		await db.execute(
			`INSERT INTO page_views (id, invitation_id, guest_ip, user_agent, referrer, guest_name)
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[
				uuidv4(),
				params.invitationId,
				params.ip || null,
				params.userAgent ? params.userAgent.slice(0, 500) : null,
				params.referrer ? params.referrer.slice(0, 500) : null,
				params.guestName || null
			]
		);
	} catch (err) {
		console.error('[Analytics] Error tracking page view:', err);
	}
}

export async function getInvitationStats(invitationId: string): Promise<{
	totalViews: number;
	uniqueVisitors: number;
	totalRsvp: number;
	totalWishes: number;
	attendingCount: number;
	notAttendingCount: number;
	dailyViews: { date: string; count: number }[];
}> {
	const db = await getDb();

	const [viewRows] = await db.execute(
		'SELECT COUNT(*) as total FROM page_views WHERE invitation_id = ?',
		[invitationId]
	);
	const totalViews = (viewRows as any[])[0].total;

	const [uniqueRows] = await db.execute(
		'SELECT COUNT(DISTINCT guest_ip) as unique_count FROM page_views WHERE invitation_id = ? AND guest_ip IS NOT NULL',
		[invitationId]
	);
	const uniqueVisitors = (uniqueRows as any[])[0].unique_count;

	const [rsvpRows] = await db.execute(
		'SELECT COUNT(*) as total FROM wishes WHERE invitation_id = ?',
		[invitationId]
	);
	const totalWishes = (rsvpRows as any[])[0].total;

	const [attendingRows] = await db.execute(
		'SELECT COUNT(*) as total FROM guests WHERE invitation_id = ? AND is_attending = 1',
		[invitationId]
	);
	const attendingCount = (attendingRows as any[])[0].total;

	const [notAttendingRows] = await db.execute(
		'SELECT COUNT(*) as total FROM guests WHERE invitation_id = ? AND is_attending = 0 AND has_responded = 1',
		[invitationId]
	);
	const notAttendingCount = (notAttendingRows as any[])[0].total;

	const totalRsvp = attendingCount + notAttendingCount;

	const [dailyRows] = await db.execute(
		`SELECT DATE(created_at) as date, COUNT(*) as count
		 FROM page_views
		 WHERE invitation_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
		 GROUP BY DATE(created_at)
		 ORDER BY date ASC`,
		[invitationId]
	);
	const dailyViews = (dailyRows as { date: string; count: number }[]);

	return { totalViews, uniqueVisitors, totalRsvp, totalWishes, attendingCount, notAttendingCount, dailyViews };
}

export async function getUserAnalytics(userId: string): Promise<{
	totalViews: number;
	totalUniqueVisitors: number;
	totalRsvp: number;
}> {
	const db = await getDb();
	const [viewRows] = await db.execute(
		`SELECT COUNT(pv.id) as total FROM page_views pv
		 JOIN invitations i ON pv.invitation_id = i.id
		 WHERE i.user_id = ?`,
		[userId]
	);
	const totalViews = (viewRows as any[])[0].total;

	const [uniqueRows] = await db.execute(
		`SELECT COUNT(DISTINCT pv.guest_ip) as unique_count FROM page_views pv
		 JOIN invitations i ON pv.invitation_id = i.id
		 WHERE i.user_id = ? AND pv.guest_ip IS NOT NULL`,
		[userId]
	);
	const totalUniqueVisitors = (uniqueRows as any[])[0].unique_count;

	const [wishRows] = await db.execute(
		`SELECT COUNT(w.id) as total FROM wishes w
		 JOIN invitations i ON w.invitation_id = i.id
		 WHERE i.user_id = ?`,
		[userId]
	);
	const totalRsvp = (wishRows as any[])[0].total;

	return { totalViews, totalUniqueVisitors, totalRsvp };
}

export async function ensurePageViewsTable(): Promise<void> {
	const db = await getDb();
	try {
		await db.execute(`
			CREATE TABLE IF NOT EXISTS page_views (
				id VARCHAR(36) PRIMARY KEY,
				invitation_id VARCHAR(36) NOT NULL,
				guest_ip VARCHAR(45) NULL,
				user_agent VARCHAR(500) NULL,
				referrer VARCHAR(500) NULL,
				guest_name VARCHAR(100) NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				INDEX idx_invitation_id (invitation_id),
				INDEX idx_created_at (created_at),
				FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
			)
		`);
	} catch (err: any) {
		if (!err.message?.includes('already exists')) throw err;
	}
}
