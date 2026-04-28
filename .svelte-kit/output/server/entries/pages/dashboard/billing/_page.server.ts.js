import { n as getSetting } from "../../../../chunks/settings.js";
import { l as updateUserAccess } from "../../../../chunks/users2.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/dashboard/billing/+page.server.ts
var load = async ({ locals }) => {
	const [premiumPrice, addonPrice, addonQuantity, paymentInstructions, templateExpansionPrice, templateExpansionQuantity] = await Promise.all([
		getSetting("premium_price"),
		getSetting("addon_guest_price"),
		getSetting("addon_guest_quantity"),
		getSetting("payment_instructions"),
		getSetting("template_expansion_price"),
		getSetting("template_expansion_quantity")
	]);
	return {
		user: locals.user,
		premiumPrice: premiumPrice || "149000",
		addonPrice: addonPrice || "19000",
		addonQuantity: addonQuantity || "50",
		paymentInstructions: paymentInstructions || "",
		templateExpansionPrice: templateExpansionPrice || "29000",
		templateExpansionQuantity: templateExpansionQuantity || "5"
	};
};
var actions = {
	initiatePayment: async ({ locals }) => {
		if (!locals.user) return fail(401);
		await updateUserAccess(locals.user.id, 0, "pending");
		throw redirect(303, "/dashboard/billing/checkout?type=premium");
	},
	initiateAddon: async ({ locals }) => {
		if (!locals.user) return fail(401);
		throw redirect(303, "/dashboard/billing/checkout?type=addon");
	},
	initiateTemplateExpansion: async ({ locals }) => {
		if (!locals.user) return fail(401);
		throw redirect(303, "/dashboard/billing/checkout?type=template-expansion");
	},
	cancelPayment: async ({ locals }) => {
		if (!locals.user) return fail(401);
		await updateUserAccess(locals.user.id, 0, "inactive");
		return {
			success: true,
			message: "Pesanan berhasil dibatalkan."
		};
	}
};
//#endregion
export { actions, load };
