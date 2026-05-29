import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';

function csvEscape(val: string | number | null | undefined): string {
	if (val === null || val === undefined) return '';
	const str = String(val);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function rowsToCsv(rows: Record<string, any>[], columns: string[]): string {
	const header = columns.map(csvEscape).join(',') + '\n';
	const body = rows.map(row =>
		columns.map(col => csvEscape(row[col])).join(',')
	).join('\n');
	return header + body;
}

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	exportUsers: async ({ locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return new Response('Unauthorized', { status: 403 });
		}
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-export'), { maxRequests: 5, windowMs: 60000 });
		if (!rl.allowed) return new Response('Rate limited', { status: 429 });

		const db = await getDb();
		const [rows] = await db.execute(
			'SELECT id, username, email, role, has_access, payment_status, invitation_limit, guest_limit, created_at FROM users ORDER BY created_at DESC'
		);
		const csv = rowsToCsv(rows as Record<string, any>[], ['id', 'username', 'email', 'role', 'has_access', 'payment_status', 'invitation_limit', 'guest_limit', 'created_at']);
		return new Response(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="users-export-${Date.now()}.csv"`
			}
		});
	},

	exportInvitations: async ({ locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return new Response('Unauthorized', { status: 403 });
		}
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-export'), { maxRequests: 5, windowMs: 60000 });
		if (!rl.allowed) return new Response('Rate limited', { status: 429 });

		const db = await getDb();
		const [rows] = await db.execute(
			`SELECT i.id, i.slug, i.groom_name, i.bride_name, i.is_published, i.akad_date, i.created_at, u.email as user_email
			 FROM invitations i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC`
		);
		const csv = rowsToCsv(rows as Record<string, any>[], ['id', 'slug', 'groom_name', 'bride_name', 'is_published', 'akad_date', 'created_at', 'user_email']);
		return new Response(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="invitations-export-${Date.now()}.csv"`
			}
		});
	},

	exportPayments: async ({ locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return new Response('Unauthorized', { status: 403 });
		}
		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-export'), { maxRequests: 5, windowMs: 60000 });
		if (!rl.allowed) return new Response('Rate limited', { status: 429 });

		const db = await getDb();
		const [rows] = await db.execute(
			`SELECT pt.id, pt.order_id, pt.user_id, pt.type, pt.amount, pt.status, pt.created_at, u.email as user_email
			 FROM payment_transactions pt JOIN users u ON pt.user_id = u.id ORDER BY pt.created_at DESC`
		);
		const csv = rowsToCsv(rows as Record<string, any>[], ['id', 'order_id', 'user_id', 'type', 'amount', 'status', 'created_at', 'user_email']);
		return new Response(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="payments-export-${Date.now()}.csv"`
			}
		});
	}
};
