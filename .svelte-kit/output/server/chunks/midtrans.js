import { n as getSetting } from "./settings.js";
//#region src/lib/server/midtrans.ts
async function createMidtransTransaction(params) {
	const serverKey = (await getSetting("midtrans_server_key"))?.trim() || "";
	const isProduction = await getSetting("midtrans_is_production") === "1";
	console.log("[Midtrans] Debug info:", {
		hasServerKey: !!serverKey,
		serverKeyLength: serverKey.length,
		isProduction,
		orderId: params.orderId
	});
	if (!serverKey) throw new Error("Midtrans Server Key is not configured in Admin Settings.");
	const baseUrl = isProduction ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";
	const authHeader = Buffer.from(serverKey + ":").toString("base64");
	const body = {
		transaction_details: {
			order_id: params.orderId,
			gross_amount: params.amount
		},
		customer_details: {
			first_name: params.customer.name.slice(0, 50),
			email: params.customer.email
		},
		item_details: [{
			id: params.item.id,
			name: params.item.name.slice(0, 50),
			price: params.item.price,
			quantity: params.item.quantity
		}],
		usage_limit: 1
	};
	const response = await fetch(baseUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Authorization": `Basic ${authHeader}`
		},
		body: JSON.stringify(body)
	});
	console.log("[Midtrans] Response status:", response.status, response.statusText);
	if (!response.ok) {
		const text = await response.text();
		let detail = response.statusText;
		try {
			const errData = JSON.parse(text);
			detail = errData.error_messages?.join("; ") || errData.status_message || errData.message || detail;
		} catch {
			if (text) detail = text.slice(0, 280);
		}
		throw new Error(`Midtrans API (${response.status}): ${detail}. Periksa pasangan Server Key + mode Sandbox/Production.`);
	}
	return JSON.parse(await response.text());
}
//#endregion
export { createMidtransTransaction as t };
