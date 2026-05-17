import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { createUser } from "$lib/server/users";
import { createSessionToken } from "$lib/server/session";
import { logAudit } from "$lib/server/audit-log";
import { TURNSTILE_SECRET_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";
import { sendWelcomeEmail, sendVerificationEmail } from "$lib/server/email";
import { getSetting } from "$lib/server/settings";
import { getClientIp } from "$lib/server/utils";
import { validatePassword } from "$lib/server/password-policy";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;
		const turnstileResponse = formData.get("cf-turnstile-response") as string;

		if (!username || !email || !password) {
			return fail(400, { error: "Semua field harus diisi", username, email });
		}

		const pwCheck = validatePassword(password);
		if (!pwCheck.valid) {
			return fail(400, {
				error: pwCheck.error || "Password tidak valid",
				username,
				email,
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { error: "Password tidak cocok", username, email });
		}

		// Rate limiting by IP
		const clientIp = getClientIp({ request } as any);
		const rlResult = checkRateLimit(ipKey(clientIp, "register"), {
			maxRequests: 3,
			windowMs: 60 * 1000,
		});
		if (!rlResult.allowed) {
			return fail(429, {
				error: "Terlalu banyak permintaan daftar. Silakan coba lagi dalam 1 menit.",
				username,
				email,
			});
		}

		// Verify Turnstile
		if (!turnstileResponse) {
			return fail(400, {
				error: "Security challenge (Turnstile) is required",
				username,
				email,
			});
		}

		try {
			const params = new URLSearchParams({
				secret: TURNSTILE_SECRET_KEY,
				response: turnstileResponse,
			});
			const verifyRes = await fetch(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: params.toString(),
				},
			);

			const verifyData = await verifyRes.json();
			if (!verifyData.success) {
				return fail(400, {
					error: "Gagal memverifikasi bahwa Anda bukan robot.",
					username,
					email,
				});
			}
		} catch (err) {
			return fail(500, {
				error: "Terjadi kesalahan sistem verifikasi.",
				username,
				email,
			});
		}

		try {
			const user = await createUser(username, email, password);

			// Audit log + trial info
			logAudit({
				action: "user.register",
				userId: user.id,
				email: user.email,
				details: "3-day trial started, email verification pending",
				ip: clientIp,
			});

			// Send verification email (async, don't block)
			getSetting("app_name")
				.then(async (appName) => {
					const appN = appName || "Wedding.id";
					const origin = process.env.ORIGIN || 'https://temuin.web.id';
					const verifyLink = `${origin}/verify-email/${user.rawVerifyToken}`;
					sendVerificationEmail(email, verifyLink, appN);
				})
				.catch(() => {});

			// Redirect to login with success message
			cookies.set("verify_success", email, {
				path: "/",
				httpOnly: true,
			maxAge: 60 * 5,
			});
			throw redirect(303, "/login?registered=1");
		} catch (err: unknown) {
			if (
				err &&
				typeof err === "object" &&
				"status" in err &&
				(err as { status: number }).status === 303
			)
				throw err;
			return fail(400, {
				error: "Username atau email sudah terdaftar",
				username,
				email,
			});
		}
	},
};
