import { n as getSetting } from "../../../../../chunks/settings.js";
import { i as updatePaymentTransactionStatus, r as findPaymentTransactionByOrderId } from "../../../../../chunks/payment-transactions.js";
import { l as updateUserAccess, n as addTemplateQuotaToUser, t as addGuestLimitToUser } from "../../../../../chunks/users2.js";
import { json } from "@sveltejs/kit";
import crypto from "crypto";
//#region src/routes/api/midtrans/notification/+server.ts
var POST = async ({ request }) => {
	const body = await request.json();
	const serverKey = (await getSetting("midtrans_server_key"))?.trim() || "";
	const signatureStr = body.order_id + body.status_code + body.gross_amount + serverKey;
	if (crypto.createHash("sha512").update(signatureStr).digest("hex") !== body.signature_key) {
		console.error("[Midtrans] Invalid Signature Key");
		return json({
			status: "error",
			message: "Invalid Signature"
		}, { status: 403 });
	}
	const orderId = body.order_id;
	const transactionStatus = body.transaction_status;
	const fraudStatus = body.fraud_status;
	console.log(`[Midtrans] Notification received: ${orderId} - Status: ${transactionStatus}`);
	if (transactionStatus === "capture" || transactionStatus === "settlement" || transactionStatus === "success") {
		if (fraudStatus === "challenge") {
			console.log(`[Midtrans] Payment Challenge for ${orderId}`);
			return json({ status: "ok" });
		}
		const paymentTx = await findPaymentTransactionByOrderId(orderId);
		if (paymentTx) {
			const userId = paymentTx.user_id;
			console.log(`[Midtrans] Payment Success for order ${orderId} - User: ${userId}`);
			if (paymentTx.type === "premium") {
				console.log(`[Midtrans] Activating Premium for User: ${userId}`);
				await updateUserAccess(userId, 1, "paid", 3);
			} else if (paymentTx.type === "addon") {
				const addonQuantity = parseInt(await getSetting("addon_guest_quantity") || "50");
				console.log(`[Midtrans] Adding ${addonQuantity} guests for User: ${userId}`);
				await addGuestLimitToUser(userId, addonQuantity);
			} else if (paymentTx.type === "template-expansion") {
				const templateQuantity = parseInt(await getSetting("template_expansion_quantity") || "5");
				console.log(`[Midtrans] Adding ${templateQuantity} templates for User: ${userId}`);
				await addTemplateQuotaToUser(userId, templateQuantity);
			}
			await updatePaymentTransactionStatus(orderId, "success");
		} else {
			const parts = orderId.split("__");
			if (parts.length < 2) {
				console.warn(`[Midtrans] Cannot parse legacy order_id: ${orderId}`);
				return json({ status: "ok" });
			}
			const legacyType = parts[0];
			const userId = parts[1];
			if (legacyType === "PREMIUM") {
				console.log(`[Midtrans] Activating Premium (legacy order_id) for User: ${userId}`);
				await updateUserAccess(userId, 1, "paid", 3);
			} else if (legacyType === "ADDON") {
				const addonQuantity = parseInt(await getSetting("addon_guest_quantity") || "50");
				console.log(`[Midtrans] Adding ${addonQuantity} guests (legacy) for User: ${userId}`);
				await addGuestLimitToUser(userId, addonQuantity);
			} else if (legacyType === "TEMPLATE_EXPANSION") {
				const templateQuantity = parseInt(await getSetting("template_expansion_quantity") || "5");
				console.log(`[Midtrans] Adding ${templateQuantity} templates (legacy) for User: ${userId}`);
				await addTemplateQuotaToUser(userId, templateQuantity);
			}
		}
	}
	return json({ status: "ok" });
};
//#endregion
export { POST };
