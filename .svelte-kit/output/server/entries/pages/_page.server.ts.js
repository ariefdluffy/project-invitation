import { m as getTemplates } from "../../chunks/invitations.js";
//#region src/routes/+page.server.ts
var load = async () => {
	return { templates: await getTemplates() };
};
//#endregion
export { load };
