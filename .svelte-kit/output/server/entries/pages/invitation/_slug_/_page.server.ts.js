import { d as getInvitationBySlug, h as getWishesByInvitation, n as addWish, p as getTemplateById } from "../../../../chunks/invitations.js";
//#region src/routes/invitation/[slug]/+page.server.ts
var load = async ({ params, url }) => {
	const { slug } = params;
	const invitation = await getInvitationBySlug(slug);
	if (!invitation) return {
		status: 404,
		error: /* @__PURE__ */ new Error("Undangan tidak ditemukan")
	};
	return {
		invitation,
		template: await getTemplateById(invitation.template_id),
		wishes: await getWishesByInvitation(invitation.id),
		guestName: url.searchParams.get("to") ?? ""
	};
};
var actions = { wish: async ({ request, params }) => {
	const data = await request.formData();
	const guestName = data.get("guest_name");
	const isAttending = data.get("is_attending");
	const message = data.get("message");
	if (!guestName || !isAttending || message === null) return { error: "Data form tidak lengkap" };
	try {
		const invitation = await getInvitationBySlug(params.slug);
		if (!invitation) return { error: "Undangan tidak ditemukan" };
		await addWish(invitation.id, guestName, message, isAttending === "hadir" ? "hadir" : "tidak_hadir");
		return { success: true };
	} catch (err) {
		console.error(err);
		return { error: "Gagal menyimpan ucapan" };
	}
} };
//#endregion
export { actions, load };
