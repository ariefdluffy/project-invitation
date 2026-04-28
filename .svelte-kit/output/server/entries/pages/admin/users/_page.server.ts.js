import { c as updateUserAccess, i as deleteUser, o as getAllUsers, r as createUser, s as getUserById } from "../../../../chunks/users2.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/admin/users/+page.server.ts
var PAYMENT_FILTERS = [
	"all",
	"paid",
	"pending",
	"payments"
];
function filterUsersByPayment(users, filter) {
	if (filter === "paid") return users.filter((u) => u.payment_status === "paid");
	if (filter === "pending") return users.filter((u) => u.payment_status === "pending");
	if (filter === "payments") return users.filter((u) => u.payment_status === "paid" || u.payment_status === "pending");
	return users;
}
var load = async ({ locals, url }) => {
	if (!locals.user || locals.user.role !== "admin") return {
		users: [],
		filter: "all",
		counts: {
			all: 0,
			paid: 0,
			pending: 0,
			payments: 0
		}
	};
	const allUsers = await getAllUsers();
	const raw = url.searchParams.get("filter") || "all";
	const filter = PAYMENT_FILTERS.includes(raw) ? raw : "all";
	const counts = {
		all: allUsers.length,
		paid: allUsers.filter((u) => u.payment_status === "paid").length,
		pending: allUsers.filter((u) => u.payment_status === "pending").length,
		payments: allUsers.filter((u) => u.payment_status === "paid" || u.payment_status === "pending").length
	};
	return {
		users: filterUsersByPayment(allUsers, filter),
		filter,
		counts
	};
};
var actions = {
	addUser: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		const formData = await request.formData();
		const username = formData.get("username");
		const email = formData.get("email");
		const password = formData.get("password");
		const role = formData.get("role") || "user";
		if (!username || !email || !password) return fail(400, { error: "Semua field wajib diisi" });
		try {
			await createUser(username, email, password, role);
			return {
				success: true,
				message: "User berhasil ditambahkan"
			};
		} catch (err) {
			return fail(400, { error: "Username atau email mungkin sudah digunakan" });
		}
	},
	updateAccess: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		const formData = await request.formData();
		const id = formData.get("id");
		const hasAccess = formData.get("has_access") === "on" ? 1 : 0;
		const paymentStatus = formData.get("payment_status");
		const invitationLimit = parseInt(formData.get("invitation_limit")) || 1;
		const guestLimit = parseInt(formData.get("guest_limit")) || 50;
		try {
			await updateUserAccess(id, hasAccess, paymentStatus, invitationLimit, guestLimit);
			return {
				success: true,
				message: "Akses user berhasil diperbarui"
			};
		} catch (err) {
			return fail(400, { error: "Gagal memperbarui akses user" });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		const id = (await request.formData()).get("id");
		if ((await getUserById(id))?.role === "admin") return fail(400, { error: "Akun Administrator tidak dapat dihapus untuk alasan keamanan." });
		try {
			await deleteUser(id);
			return {
				success: true,
				message: "User berhasil dihapus"
			};
		} catch (err) {
			return fail(400, { error: "Gagal menghapus user" });
		}
	}
};
//#endregion
export { actions, load };
