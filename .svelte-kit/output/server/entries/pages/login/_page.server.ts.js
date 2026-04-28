import { r as authenticateUser } from "../../../chunks/users2.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.ts
var actions = { default: async ({ request, cookies }) => {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	if (!email || !password) return fail(400, {
		error: "Email dan password harus diisi",
		email
	});
	const user = await authenticateUser(email, password);
	if (!user) return fail(400, {
		error: "Email atau password salah",
		email
	});
	cookies.set("session", JSON.stringify({ userId: user.id }), {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		maxAge: 3600 * 24 * 7
	});
	if (user.role === "admin") throw redirect(303, "/admin");
	throw redirect(303, "/dashboard");
} };
//#endregion
export { actions };
