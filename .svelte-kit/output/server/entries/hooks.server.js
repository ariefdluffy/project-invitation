import { n as ensurePaymentTransactionsTable } from "../chunks/payment-transactions.js";
import { c as getUserById } from "../chunks/users2.js";
import { _ as seedSettings, g as seedAdmin, v as seedTemplates } from "../chunks/invitations.js";
//#region src/hooks.server.ts
var seeded = false;
var handle = async ({ event, resolve }) => {
	if (event.url.searchParams.has("reseed")) seeded = false;
	if (!seeded) {
		console.log("[Server] Seeding database templates and settings...");
		await seedTemplates();
		await seedSettings();
		await seedAdmin();
		await ensurePaymentTransactionsTable();
		seeded = true;
	}
	const sessionCookie = event.cookies.get("session");
	if (sessionCookie) try {
		const user = await getUserById(JSON.parse(sessionCookie).userId);
		if (user) event.locals.user = user;
	} catch {}
	if (event.url.pathname.startsWith("/admin")) {
		if (!event.locals.user || event.locals.user.role !== "admin") return new Response(null, {
			status: 302,
			headers: { location: "/login" }
		});
	}
	if (event.url.pathname.startsWith("/dashboard")) {
		if (!event.locals.user) return new Response(null, {
			status: 302,
			headers: { location: "/login" }
		});
	}
	return await resolve(event);
};
//#endregion
export { handle };
