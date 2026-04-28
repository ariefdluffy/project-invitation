import { n as getSetting } from "../../../../chunks/settings.js";
import { f as getInvitationsByUser, o as duplicateInvitation } from "../../../../chunks/invitations.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/dashboard/invitations/+page.server.ts
var load = async ({ locals, url }) => {
	const invitations = await getInvitationsByUser(locals.user.id);
	const appName = await getSetting("app_name") || "Wedding.id";
	const error = url.searchParams.get("error");
	return {
		user: locals.user,
		invitations,
		appName,
		error
	};
};
var actions = { duplicate: async ({ request, locals }) => {
	if (!locals.user) return fail(401);
	const id = (await request.formData()).get("id");
	if ((await getInvitationsByUser(locals.user.id)).length >= locals.user.invitation_limit) return fail(400, { error: `Limit undangan tercapai (${locals.user.invitation_limit}).` });
	try {
		throw redirect(303, `/dashboard/invitations/${await duplicateInvitation(id)}`);
	} catch (err) {
		if (err.status) throw err;
		console.error("[Duplicate] Error:", err);
		return fail(500, { error: "Gagal menduplikat undangan." });
	}
} };
//#endregion
export { actions, load };
