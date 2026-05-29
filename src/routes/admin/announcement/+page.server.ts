import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { logAudit } from '$lib/server/audit-log';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';
import { sendEmail } from '$lib/server/email';
import { getSetting } from '$lib/server/settings';

export const actions: Actions = {
	send: async ({ request, locals, getClientAddress }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const rl = checkRateLimit(ipKey(getClientAddress(), 'admin-announce'), { maxRequests: 1, windowMs: 300000 });
		if (!rl.allowed) return fail(429, { error: 'Hanya bisa kirim 1x per 5 menit. Coba lagi nanti.' });

		const formData = await request.formData();
		const subject = (formData.get('subject') as string || '').trim();
		const body = (formData.get('body') as string || '').trim();
		const target = formData.get('target') as string || 'all';

		if (!subject || !body) return fail(400, { error: 'Subject dan body harus diisi' });
		if (subject.length > 200) return fail(400, { error: 'Subject maksimal 200 karakter' });

		const db = await getDb();
		let users: { email: string; username: string }[];

		if (target === 'paid') {
			const [rows] = await db.execute('SELECT email, username FROM users WHERE payment_status = ?', ['paid']);
			users = rows as any[];
		} else if (target === 'unpaid') {
			const [rows] = await db.execute("SELECT email, username FROM users WHERE payment_status != 'paid'");
			users = rows as any[];
		} else {
			const [rows] = await db.execute('SELECT email, username FROM users');
			users = rows as any[];
		}

		if (users.length === 0) return fail(400, { error: 'Tidak ada user target' });

		const appName = await getSetting('app_name') || 'Wedding Invitation';
		let sent = 0;
		let failed = 0;

		// Send with concurrency limit of 5
		const concurrency = 5;
		for (let i = 0; i < users.length; i += concurrency) {
			const batch = users.slice(i, i + concurrency);
			const results = await Promise.allSettled(
				batch.map(u => sendEmail({
					to: u.email,
					subject: `[${appName}] ${subject}`,
					html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
						<h2>${subject}</h2>
						<p>Halo ${u.username},</p>
						<div>${body}</div>
						<hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
						<p style="color:#999;font-size:12px">${appName}</p>
					</div>`
				}))
			);
			for (const r of results) {
				if (r.status === 'fulfilled') sent++;
				else failed++;
			}
		}

		logAudit({
			action: 'admin.announcement',
			userId: locals.user.id,
			details: `Broadcast "${subject}" to ${users.length} users (${target}): ${sent} sent, ${failed} failed`
		}).catch(() => {});

		return { success: true, message: `Broadcast terkirim ke ${sent}/${users.length} user${failed > 0 ? ` (${failed} gagal)` : ''}` };
	}
};
