import { n as getSetting } from "../../../chunks/settings.js";
import { f as getInvitationsByUser } from "../../../chunks/invitations.js";
//#region src/routes/dashboard/+layout.server.ts
var load = async ({ locals }) => {
	const invitations = await getInvitationsByUser(locals.user.id);
	const appName = await getSetting("app_name") || "Wedding.id";
	return {
		user: locals.user,
		invitations,
		appName
	};
};
//#endregion
export { load };
