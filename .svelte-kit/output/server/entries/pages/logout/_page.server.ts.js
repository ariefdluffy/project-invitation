import { redirect } from "@sveltejs/kit";
//#region src/routes/logout/+page.server.ts
var actions = { default: async ({ cookies }) => {
	cookies.delete("session", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false
	});
	throw redirect(303, "/");
} };
//#endregion
export { actions };
