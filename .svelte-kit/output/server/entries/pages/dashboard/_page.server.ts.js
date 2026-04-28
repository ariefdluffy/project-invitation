import { c as getGuestStatsByUser } from "../../../chunks/invitations.js";
//#region src/routes/dashboard/+page.server.ts
var load = async ({ locals }) => {
	return { guestStats: await getGuestStatsByUser(locals.user.id) };
};
//#endregion
export { load };
