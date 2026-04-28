import { n as getSetting } from "../../../../../chunks/settings.js";
import { t as createMidtransTransaction } from "../../../../../chunks/midtrans.js";
import { t as createPaymentTransaction } from "../../../../../chunks/payment-transactions.js";
import { t as buildMidtransOrderId } from "../../../../../chunks/midtrans-order-id.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/dashboard/billing/checkout/+page.server.ts
var load = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, "/login");
	const type = url.searchParams.get("type") || "premium";
	const [premiumPrice, addonPrice, addonQuantity, templateExpansionPrice, templateExpansionQuantity, clientKey, appName, isProdSetting] = await Promise.all([
		getSetting("premium_price"),
		getSetting("addon_guest_price"),
		getSetting("addon_guest_quantity"),
		getSetting("template_expansion_price"),
		getSetting("template_expansion_quantity"),
		getSetting("midtrans_client_key"),
		getSetting("app_name"),
		getSetting("midtrans_is_production")
	]);
	const isProduction = isProdSetting === "1";
	const clientKeyTrim = (clientKey || "").trim();
	if (!clientKeyTrim) return {
		error: "Midtrans Client Key belum diisi. Tambahkan Client Key di Admin → App Settings (Sandbox/Production harus cocok dengan Server Key).",
		isProduction,
		clientKey: null
	};
	let amount = parseInt(premiumPrice || "149000");
	let itemName = `Paket Premium ${appName || "Wedding.id"}`;
	let itemId = "PREMIUM";
	if (type === "addon") {
		amount = parseInt(addonPrice || "19000");
		itemName = `Add-on +${addonQuantity || 50} Kuota Tamu`;
		itemId = `ADDON_${addonQuantity || 50}`;
	} else if (type === "template-expansion") {
		amount = parseInt(templateExpansionPrice || "29000");
		itemName = `Ekspansi +${templateExpansionQuantity || 5} Template Undangan`;
		itemId = `TEMPLATE_EXPANSION_${templateExpansionQuantity || 5}`;
	}
	const orderType = type === "addon" ? "addon" : type === "template-expansion" ? "template-expansion" : "premium";
	const orderId = buildMidtransOrderId(orderType, locals.user.id);
	try {
		const transaction = await createMidtransTransaction({
			orderId,
			amount,
			customer: {
				name: locals.user.username,
				email: locals.user.email
			},
			item: {
				id: itemId,
				name: itemName,
				price: amount,
				quantity: 1
			}
		});
		await createPaymentTransaction(locals.user.id, orderId, orderType, amount);
		return {
			snapToken: transaction.token,
			clientKey: clientKeyTrim,
			isProduction,
			amount,
			itemName,
			orderId
		};
	} catch (err) {
		console.error("[Midtrans] Error creating transaction:", err);
		const msg = err instanceof Error ? err.message : String(err);
		return {
			error: msg.includes("Midtrans API") || msg.includes("Server Key is not configured") ? msg : "Gagal membuat transaksi Snap. Pastikan Server Key benar, mode Sandbox/Production sesuai key, lalu simpan ulang di Admin Settings.",
			isProduction,
			clientKey: null
		};
	}
};
var actions = {};
//#endregion
export { actions, load };
