import { n as getSetting } from "../../../../chunks/settings.js";
import { f as getInvitationsByUser, m as getTemplates, r as createInvitation } from "../../../../chunks/invitations.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/dashboard/create/+page.server.ts
var load = async ({ locals }) => {
	if (locals.user?.role !== "admin" && locals.user?.has_access !== 1) throw redirect(303, "/dashboard/billing");
	const userInvitations = await getInvitationsByUser(locals.user.id);
	if (locals.user?.role !== "admin" && userInvitations.length >= (locals.user?.invitation_limit || 1)) throw redirect(303, "/dashboard/invitations?error=limit_reached");
	return { templates: await getTemplates() };
};
var actions = { default: async ({ request, locals }) => {
	if (locals.user?.role !== "admin" && locals.user?.has_access !== 1) return fail(403, { error: "Anda belum memiliki akses untuk membuat undangan. Silakan lakukan pembayaran terlebih dahulu." });
	const userInvitations = await getInvitationsByUser(locals.user.id);
	if (locals.user?.role !== "admin" && userInvitations.length >= (locals.user?.invitation_limit || 1)) return fail(403, { error: `Anda telah mencapai batas maksimal membuat undangan (${locals.user?.invitation_limit}).` });
	const formData = await request.formData();
	const templateId = formData.get("template_id");
	const groomName = formData.get("groom_name");
	const brideName = formData.get("bride_name");
	const slug = formData.get("slug");
	if (!templateId || !groomName || !brideName || !slug) return fail(400, { error: "Semua field wajib harus diisi" });
	if (!/^[a-z0-9-]+$/.test(slug)) return fail(400, { error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung" });
	await getTemplates();
	const defaultMusic = await getSetting("default_music_url") || "";
	try {
		throw redirect(303, `/dashboard/invitations/${(await createInvitation({
			user_id: locals.user.id,
			template_id: templateId,
			slug,
			groom_name: groomName,
			groom_full_name: formData.get("groom_full_name") || "",
			groom_parents: formData.get("groom_parents") || "",
			groom_instagram: formData.get("groom_instagram") || "",
			bride_name: brideName,
			bride_full_name: formData.get("bride_full_name") || "",
			bride_parents: formData.get("bride_parents") || "",
			bride_instagram: formData.get("bride_instagram") || "",
			quote: formData.get("quote") || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
			quote_source: formData.get("quote_source") || "QS Ar-Rum : 21",
			akad_date: formData.get("akad_date") || "",
			akad_time: formData.get("akad_time") || "",
			resepsi_date: formData.get("resepsi_date") || "",
			resepsi_time: formData.get("resepsi_time") || "",
			venue_name: formData.get("venue_name") || "",
			venue_address: formData.get("venue_address") || "",
			venue_map_url: formData.get("venue_map_url") || "",
			love_story: formData.get("love_story") || "",
			bank_accounts: formData.get("bank_accounts") || "[]",
			dress_code_colors: formData.get("dress_code_colors") || "[]",
			music_url: formData.get("music_url") || defaultMusic
		})).id}`);
	} catch (err) {
		if (err && typeof err === "object" && "status" in err && err.status === 303) throw err;
		return fail(400, { error: "Gagal membuat undangan. Slug mungkin sudah digunakan." });
	}
} };
//#endregion
export { actions, load };
