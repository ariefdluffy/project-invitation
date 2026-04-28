import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
	createUser,
	updateUserAccess,
	deleteUser,
	getAllUsers,
	getUserById,
	updateUserPassword
} from '$lib/server/users';
import { generateRandomPassword } from '$lib/server/utils';
import type { User } from '$lib/server/users';

const PAYMENT_FILTERS = ['all', 'paid', 'pending', 'payments'] as const;
type PaymentFilter = (typeof PAYMENT_FILTERS)[number];

function filterUsersByPayment(users: User[], filter: PaymentFilter): User[] {
	if (filter === 'paid') return users.filter((u) => u.payment_status === 'paid');
	if (filter === 'pending') return users.filter((u) => u.payment_status === 'pending');
	if (filter === 'payments')
		return users.filter((u) => u.payment_status === 'paid' || u.payment_status === 'pending');
	return users;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		return {
			users: [],
			filter: 'all' as PaymentFilter,
			counts: { all: 0, paid: 0, pending: 0, payments: 0 }
		};
	}
	const allUsers = await getAllUsers();
	const raw = url.searchParams.get('filter') || 'all';
	const filter: PaymentFilter = PAYMENT_FILTERS.includes(raw as PaymentFilter)
		? (raw as PaymentFilter)
		: 'all';
	const counts = {
		all: allUsers.length,
		paid: allUsers.filter((u) => u.payment_status === 'paid').length,
		pending: allUsers.filter((u) => u.payment_status === 'pending').length,
		payments: allUsers.filter(
			(u) => u.payment_status === 'paid' || u.payment_status === 'pending'
		).length
	};
	return {
		users: filterUsersByPayment(allUsers, filter),
		filter,
		counts
	};
};

export const actions: Actions = {
	addUser: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const role = formData.get('role') as string || 'user';

		if (!username || !email || !password) {
			return fail(400, { error: 'Semua field wajib diisi' });
		}

		try {
			await createUser(username, email, password, role);
			return { success: true, message: 'User berhasil ditambahkan' };
		} catch (err) {
			return fail(400, { error: 'Username atau email mungkin sudah digunakan' });
		}
	},

	updateAccess: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const hasAccess = formData.get('has_access') === 'on' ? 1 : 0;
		const paymentStatus = formData.get('payment_status') as string;
		const invitationLimit = parseInt(formData.get('invitation_limit') as string) || 1;
		const guestLimit = parseInt(formData.get('guest_limit') as string) || 50;

		try {
			await updateUserAccess(id, hasAccess, paymentStatus, invitationLimit, guestLimit);
			return { success: true, message: 'Akses user berhasil diperbarui' };
		} catch (err) {
			return fail(400, { error: 'Gagal memperbarui akses user' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		// Prevent deleting the last admin or any admin for safety
		const userToDelete = await getUserById(id);
		if (userToDelete?.role === 'admin') {
			return fail(400, { error: 'Akun Administrator tidak dapat dihapus untuk alasan keamanan.' });
		}

		try {
			await deleteUser(id);
			return { success: true, message: 'User berhasil dihapus' };
		} catch (err) {
			return fail(400, { error: 'Gagal menghapus user' });
		}
	},

	resetPassword: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Tidak memiliki akses' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'ID pengguna tidak valid.' });
		}

		try {
			const newRandomPassword = generateRandomPassword();
			await updateUserPassword(id, newRandomPassword);
			return { success: true, message: `Password berhasil direset. Password baru: ${newRandomPassword}` };
		} catch (err) {
			console.error('[Admin Users] Error resetting password:', err);
			return fail(500, { error: 'Gagal mereset password user.' });
		}
	}
};
