import { t as createMidtransTransaction } from "../../../../../chunks/midtrans.js";
import { t as createPaymentTransaction } from "../../../../../chunks/payment-transactions.js";
import { t as buildMidtransOrderId } from "../../../../../chunks/midtrans-order-id.js";
import { json } from "@sveltejs/kit";
import { v4 } from "uuid";
//#region src/routes/api/midtrans/create-transaction/+server.ts
var POST = async ({ request }) => {
	try {
		const { userId, invitationId, packageType, additionalGuests = 0 } = await request.json();
		if (!userId || !invitationId || !packageType) return json({ error: "Missing required fields: userId, invitationId, packageType" }, { status: 400 });
		const orderId = buildMidtransOrderId("premium", v4());
		const baseAmount = packageType === "premium" ? 99e3 : 49e3;
		const totalAmount = baseAmount + additionalGuests * 19e3;
		const snapTransaction = await createMidtransTransaction({
			orderId,
			amount: totalAmount,
			customer: {
				name: "User",
				email: "user@example.com"
			},
			item: {
				id: packageType,
				name: `Undangan Pernikahan - ${packageType.toUpperCase()} Package`,
				price: baseAmount,
				quantity: 1
			}
		});
		await createPaymentTransaction(userId, orderId, packageType, totalAmount);
		console.log("[Payment API] Transaction created successfully:", {
			orderId,
			amount: totalAmount,
			snapToken: snapTransaction.token ? "generated" : "missing"
		});
		return json({
			success: true,
			orderId,
			snapToken: snapTransaction.token,
			redirectUrl: snapTransaction.redirect_url,
			amount: totalAmount
		});
	} catch (error) {
		console.error("[Payment API] Error creating transaction:", error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			details: "Gagal membuat transaksi Snap. Pastikan Server Key benar, mode Sandbox/Production sesuai key, lalu simpan ulang di Admin Settings."
		}, { status: 500 });
	}
};
//#endregion
export { POST };
