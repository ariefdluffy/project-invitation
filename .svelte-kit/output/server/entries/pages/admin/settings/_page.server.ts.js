import { r as updateSetting, t as getAllSettings } from "../../../../chunks/settings.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/admin/settings/+page.server.ts
/** Hanya field form yang boleh ditulis ke tabel settings (hindari key asing / submit noise). */
var ALLOWED_SETTING_KEYS = new Set([
	"premium_price",
	"addon_guest_price",
	"addon_guest_quantity",
	"midtrans_server_key",
	"midtrans_client_key",
	"midtrans_is_production",
	"app_name",
	"payment_instructions",
	"default_music_url",
	"template_expansion_price",
	"template_expansion_quantity"
]);
var load = async ({ locals }) => {
	if (!locals.user || locals.user.role !== "admin") return { settings: {} };
	return { settings: await getAllSettings() };
};
var actions = { update: async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== "admin") return fail(403, { error: "Tidak memiliki akses" });
	const formData = await request.formData();
	try {
		for (const [key, value] of formData.entries()) {
			if (typeof value !== "string" || !ALLOWED_SETTING_KEYS.has(key)) continue;
			const trimmed = value.trim();
			if ((key === "midtrans_server_key" || key === "midtrans_client_key") && trimmed === "") continue;
			await updateSetting(key, trimmed);
		}
		return {
			success: true,
			message: "Pengaturan berhasil diperbarui"
		};
	} catch (err) {
		console.error("[admin/settings] update", err);
		return fail(400, { error: "Gagal memperbarui pengaturan" });
	}
} };
//#endregion
export { actions, load };
