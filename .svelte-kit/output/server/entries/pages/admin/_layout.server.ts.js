import { n as getSetting } from "../../../chunks/settings.js";
import { o as getAllUsers } from "../../../chunks/users2.js";
import { m as getTemplates, s as getAllInvitations } from "../../../chunks/invitations.js";
//#region src/routes/admin/+layout.server.ts
var load = async () => {
	const [invitations, users, templates, appName] = await Promise.all([
		getAllInvitations(),
		getAllUsers(),
		getTemplates(),
		getSetting("app_name").then((v) => v || "Wedding.id")
	]);
	return {
		invitations,
		users,
		templates,
		appName
	};
};
//#endregion
export { load };
