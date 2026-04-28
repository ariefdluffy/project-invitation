import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { updateUserPassword, getUserById } from '$lib/server/users';
import bcryptjs from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	// We only need user ID, email, username for the profile page, not password hash
	const user = await getUserById(locals.user.id);
	if (!user) {
		throw redirect(302, '/login'); // Should not happen if locals.user exists
	}

	const { password: _, ...userWithoutPassword } = user; // Ensure password hash is not sent to frontend
	return { user: userWithoutPassword };
};

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Tidak memiliki akses.' });
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { error: 'Semua kolom wajib diisi.' });
		}

		if (newPassword.length < 6) {
			return fail(400, { error: 'Password baru minimal 6 karakter.' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Konfirmasi password tidak cocok.' });
		}

		// Verify current password
		const userWithPassword = await getUserById(locals.user.id);
		if (!userWithPassword || !userWithPassword.password) {
			return fail(404, { error: 'Pengguna tidak ditemukan atau password tidak ada.' });
		}

		if (!bcryptjs.compareSync(currentPassword, userWithPassword.password)) {
			return fail(400, { error: 'Password saat ini salah.' });
		}

		try {
			await updateUserPassword(locals.user.id, newPassword);
			return { success: true, message: 'Password berhasil diperbarui.' };
		} catch (error) {
			console.error('[Dashboard Profile] Error updating password:', error);
			return fail(500, { error: 'Terjadi kesalahan saat memperbarui password.' });
		}
	}
};