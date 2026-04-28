import { n as getSetting } from "../../chunks/settings.js";
//#region src/routes/+layout.server.ts
var load = async ({ locals }) => {
	const appName = await getSetting("app_name") || "Wedding.id";
	return {
		user: locals.user || null,
		appName
	};
};
//#endregion
export { load };
