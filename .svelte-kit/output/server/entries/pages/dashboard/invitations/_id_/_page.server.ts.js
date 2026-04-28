import { a as deleteInvitation, h as getWishesByInvitation, i as deleteGuest, l as getGuestsByInvitation, m as getTemplates, t as addGuest, u as getInvitationById, y as updateInvitation } from "../../../../../chunks/invitations.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
//#region src/routes/dashboard/invitations/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	const invitation = await getInvitationById(params.id);
	if (!invitation) throw error(404, "Undangan tidak ditemukan");
	if (invitation.user_id !== locals.user.id && locals.user.role !== "admin") throw error(403, "Tidak memiliki akses");
	const [guests, wishes, templates] = await Promise.all([
		getGuestsByInvitation(params.id),
		getWishesByInvitation(params.id),
		getTemplates()
	]);
	return {
		invitation,
		guests,
		wishes,
		templates
	};
};
var actions = {
	update: async ({ request, params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || invitation.user_id !== locals.user.id && locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		const formData = await request.formData();
		const data = {};
		const manualTemplateId = formData.get("template_id");
		if (manualTemplateId) data.template_id = manualTemplateId;
		const uploadDir = join(process.cwd(), "static", "uploads");
		if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
		for (const [key, value] of formData.entries()) {
			if (key === "_action" || key === "template_id") continue;
			if (value instanceof File && value.size > 0) {
				const ext = value.name.split(".").pop();
				const fileName = `${params.id}-${key}-${Date.now()}.${ext}`;
				writeFileSync(join(uploadDir, fileName), Buffer.from(await value.arrayBuffer()));
				data[key] = `/uploads/${fileName}`;
			} else if (key === "custom_content") data[key] = value;
			else if (!(value instanceof File)) data[key] = value === "" ? null : value;
		}
		try {
			await updateInvitation(params.id, data);
			return {
				success: true,
				message: "Undangan berhasil diperbarui"
			};
		} catch (e) {
			console.error("Update error:", e);
			return fail(500, { error: e.message || "Gagal memperbarui undangan" });
		}
	},
	publish: async ({ params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || invitation.user_id !== locals.user.id && locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		await updateInvitation(params.id, { is_published: 1 });
		return {
			success: true,
			message: "Undangan berhasil dipublikasikan"
		};
	},
	unpublish: async ({ params, locals }) => {
		const invitation = await getInvitationById(params.id);
		if (!invitation || invitation.user_id !== locals.user.id && locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
		await updateInvitation(params.id, { is_published: 0 });
		return {
			success: true,
			message: "Undangan berhasil di-unpublish"
		};
	},
	addGuest: async ({ request, params }) => {
		const name = (await request.formData()).get("guest_name");
		if (!name) return fail(400, { error: "Nama tamu harus diisi" });
		await addGuest(params.id, name);
		return {
			success: true,
			message: "Tamu berhasil ditambahkan"
		};
	},
	deleteGuest: async ({ request }) => {
		await deleteGuest((await request.formData()).get("guest_id"));
		return {
			success: true,
			message: "Tamu berhasil dihapus"
		};
	},
	delete: async ({ params }) => {
		await deleteInvitation(params.id);
		throw redirect(303, "/dashboard/invitations");
	}
};
//#endregion
export { actions, load };
