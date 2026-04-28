//#region src/lib/server/midtrans-order-id.ts
function buildMidtransOrderId(type, userId) {
	if (userId.length !== 36) throw new Error("Invalid user id for Midtrans order_id - must be 36 char UUID");
	return `${type === "premium" ? "P" : "A"}_${userId.replace(/-/g, "").slice(0, 12)}_${Date.now().toString(16).slice(-6)}`;
}
//#endregion
export { buildMidtransOrderId as t };
