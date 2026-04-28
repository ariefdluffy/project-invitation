import { c as getUserById, u as updateUserPassword } from "../../../../chunks/users2.js";
import { fail, redirect } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
//#region src/routes/admin/profile/+page.server.ts
var load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, "/login");
	const user = await getUserById(locals.user.id);
	if (!user) throw redirect(302, "/login");
	const { password: _, ...userWithoutPassword } = user;
	return { user: userWithoutPassword };
};
var actions = { updatePassword: async ({ request, locals }) => {
	if (!locals.user) return fail(401, { error: "Tidak memiliki akses." });
	const formData = await request.formData();
	const currentPassword = formData.get("currentPassword");
	const newPassword = formData.get("newPassword");
	const confirmPassword = formData.get("confirmPassword");
	if (!currentPassword || !newPassword || !confirmPassword) return fail(400, { error: "Semua kolom wajib diisi." });
	if (newPassword.length < 6) return fail(400, { error: "Password baru minimal 6 karakter." });
	if (newPassword !== confirmPassword) return fail(400, { error: "Konfirmasi password tidak cocok." });
	const userWithPassword = await getUserById(locals.user.id);
	if (!userWithPassword || !userWithPassword.password) return fail(404, { error: "Pengguna tidak ditemukan atau password tidak ada." });
	if (!bcryptjs.compareSync(currentPassword, userWithPassword.password)) return fail(400, { error: "Password saat ini salah." });
	try {
		await updateUserPassword(locals.user.id, newPassword);
		return {
			success: true,
			message: "Password berhasil diperbarui."
		};
	} catch (error) {
		console.error("[Dashboard Profile] Error updating password:", error);
		return fail(500, { error: "Terjadi kesalahan saat memperbarui password." });
	}
} };
//#endregion
export { actions, load };
