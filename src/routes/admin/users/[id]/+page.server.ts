import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getUserById, deleteUser, updateUserAccess, updateUserPassword } from '$lib/server/users';
import { getInvitationsByUser } from '$lib/server/invitations';
import { getAuditLogsByUser } from '$lib/server/audit-log';
import { getPaymentTransactionsByUser } from '$lib/server/payment-transactions';
import { generateRandomPassword } from '$lib/server/utils';
import { logAudit } from '$lib/server/audit-log';
import { checkRateLimit, ipKey } from '$lib/server/rate-limiter';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	const user = await getUserById(params.id);
	if (!user) throw error(404, 'User tidak ditemukan');

	const [invitations, auditLogs, payments] = await Promise.all([
		getInvitationsByUser(params.id),
		getAuditLogsByUser(params.id, 50),
		getPaymentTransactionsByUser(params.id)
	]);

	return { user, invitations, auditLogs, payments };
};

export const actions: Actions = {
	updateAccess: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const hasAccess = formData.get('has_access') === 'on' ? 1 : 0;
		const paymentStatus = formData.get('payment_status') as string || 'unpaid';
		const invitationLimit = parseInt(formData.get('invitation_limit') as string) || 1;
		const guestLimit = parseInt(formData.get('guest_limit') as string) || 50;

		await updateUserAccess(id, hasAccess, paymentStatus, invitationLimit, guestLimit);
		logAudit({ action: 'admin.user_update', userId: locals.user.id, details: `Updated access for user ${id}` }).catch(() => {});
		return { success: true, message: 'Akses user diperbarui' };
	},

	resetPassword: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });

		const rl = checkRateLimit(ipKey('admin-resetpw-detail'), { maxRequests: 5, windowMs: 60000 });
		if (!rl.allowed) return fail(429, { error: 'Terlalu banyak percobaan' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const newPassword = generateRandomPassword();
		await updateUserPassword(id, newPassword);
		logAudit({ action: 'admin.password_reset', userId: locals.user.id, details: `Reset password for user ${id}` }).catch(() => {});
		return { success: true, message: `Password berhasil direset. Password baru: ${newPassword}`, newPassword };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') return fail(403, { error: 'Tidak memiliki akses' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const user = await getUserById(id);
		if (user?.role === 'admin') return fail(400, { error: 'Tidak bisa hapus admin' });

		await deleteUser(id);
		logAudit({ action: 'admin.user_delete', userId: locals.user.id, details: `Deleted user ${id}` }).catch(() => {});
		throw redirect(303, '/admin/users');
	}
};
