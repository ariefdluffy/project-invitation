import { r as createUser } from "../../../chunks/users2.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/register/+page.server.ts
var actions = { default: async ({ request, cookies }) => {
	const formData = await request.formData();
	const username = formData.get("username");
	const email = formData.get("email");
	const password = formData.get("password");
	const confirmPassword = formData.get("confirmPassword");
	if (!username || !email || !password) return fail(400, {
		error: "Semua field harus diisi",
		username,
		email
	});
	if (password.length < 6) return fail(400, {
		error: "Password minimal 6 karakter",
		username,
		email
	});
	if (password !== confirmPassword) return fail(400, {
		error: "Password tidak cocok",
		username,
		email
	});
	try {
		const user = await createUser(username, email, password);
		cookies.set("session", JSON.stringify({ userId: user.id }), {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 3600 * 24 * 7
		});
		throw redirect(303, "/dashboard");
	} catch (err) {
		if (err && typeof err === "object" && "status" in err && err.status === 303) throw err;
		return fail(400, {
			error: "Username atau email sudah terdaftar",
			username,
			email
		});
	}
} };
//#endregion
export { actions };
