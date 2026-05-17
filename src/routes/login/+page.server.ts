import type { Actions } from './$types';
import { fail, redirect } from "@sveltejs/kit";
import { authenticateUser, getUserByEmail, regenerateEmailVerifyToken } from "$lib/server/users";
import { buildSessionToken, SESSION_TTL_SECONDS } from "$lib/server/session";
import { createSession } from "$lib/server/session-store";
import {
	getLockState,
	recordFailedLogin,
	clearFailedLogins,
	LOCKOUT_THRESHOLD,
} from "$lib/server/account-lockout";
import { logAudit } from "$lib/server/audit-log";
import { TURNSTILE_SECRET_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";
import { getClientIp } from "$lib/server/utils";
import { sendVerificationEmail } from "$lib/server/email";
import { getSetting } from "$lib/server/settings";
import { createLogger } from "$lib/server/logger";

const log = createLogger("Login");

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const turnstileResponse = formData.get("cf-turnstile-response") as string;

		if (!email || !password) {
			return fail(400, { error: "Email dan password harus diisi", email });
		}

		// Rate limiting by IP + email
		const clientIp = getClientIp({ request } as any);
		const rlResult = checkRateLimit(ipKey(clientIp, "login"), {
			maxRequests: 5,
			windowMs: 60 * 1000,
		});
		if (!rlResult.allowed) {
			return fail(429, {
				error: "Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.",
				email,
			});
		}

		// Verify Turnstile
		if (!turnstileResponse) {
			return fail(400, {
				error: "Security challenge (Turnstile) is required",
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
				console.error("Turnstile verification failed:", verifyData);
				return fail(400, {
					error: "Gagal memverifikasi bahwa Anda bukan robot.",
					email,
				});
			}
		} catch (err) {
			console.error("Error verifying Turnstile:", err);
			return fail(500, {
				error: "Terjadi kesalahan sistem saat verifikasi keamanan.",
				email,
			});
		}

		// Account-level lockout (independent of IP)
		const lockState = await getLockState(email);
		if (lockState.locked) {
			const minutes = lockState.until
				? Math.max(1, Math.ceil((lockState.until.getTime() - Date.now()) / 60000))
				: 15;
			return fail(423, {
				error: `Akun terkunci karena terlalu banyak percobaan login gagal. Coba lagi dalam ${minutes} menit.`,
				email,
			});
		}

		// Authenticate user
		const user = await authenticateUser(email, password);
		if (!user) {
			const lockResult = await recordFailedLogin(email);
			if (lockResult.locked) {
				log.warn("Account locked", { email });
				return fail(423, {
					error: `Akun terkunci setelah ${LOCKOUT_THRESHOLD} percobaan login gagal. Coba lagi dalam 15 menit.`,
					email,
				});
			}
			return fail(401, { error: "Email atau password salah", email });
		}

		// Successful authentication: reset failed-attempt counter
		await clearFailedLogins(user.id);

		// Check if email is verified (skip for admins)
		if (user.email_verified !== 1 && user.role !== 'admin') {
			return fail(403, { error: "Email belum diverifikasi. Silakan cek inbox email Anda.", email });
		}

		// Create server-side session row + signed cookie referencing it
		const userAgent = request.headers.get("user-agent") || "";
		const sid = await createSession({
			userId: user.id,
			userAgent,
			ip: clientIp,
			ttlSeconds: SESSION_TTL_SECONDS,
		});
		const sessionToken = buildSessionToken(sid, user.id);

		// Audit log
		logAudit({
			action: "user.login",
			userId: user.id,
			email: user.email,
			ip: clientIp,
		});

		cookies.set("session", sessionToken, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: !dev,
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		// Redirect to dashboard or admin
		if (user.role === "admin") {
			cookies.set(
				"flash",
				JSON.stringify({
					id: crypto.randomUUID(),
					type: "success",
					message: "Login admin berhasil.",
				}),
				{
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					secure: !dev,
				},
			);
			throw redirect(303, "/admin");
		}
		cookies.set(
			"flash",
			JSON.stringify({
				id: crypto.randomUUID(),
				type: "success",
				message: "Login berhasil.",
			}),
			{
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: !dev,
			},
		);
		throw redirect(303, "/dashboard");
	},

	resendVerification: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const turnstileResponse = formData.get("cf-turnstile-response") as string;

		if (!email) {
			return fail(400, { error: "Email harus diisi", email });
		}

		// Rate limiting by IP
		const clientIp = getClientIp({ request } as any);
		const rlResult = checkRateLimit(ipKey(clientIp, "resend"), {
			maxRequests: 3,
			windowMs: 60 * 1000,
		});
		if (!rlResult.allowed) {
			return fail(429, {
				error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.",
				email,
			});
		}

		// Verify Turnstile
		if (!turnstileResponse) {
			return fail(400, {
				error: "Security challenge (Turnstile) is required",
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
				console.error("Turnstile verification failed:", verifyData);
				return fail(400, {
					error: "Gagal memverifikasi bahwa Anda bukan robot.",
					email,
				});
			}
		} catch (err) {
			console.error("Error verifying Turnstile:", err);
			return fail(500, {
				error: "Terjadi kesalahan sistem saat verifikasi keamanan.",
				email,
			});
		}

		// Always return success generic to prevent email enumeration
		const user = await getUserByEmail(email);

		// Only send email if user exists AND not yet verified
		if (user && user.email_verified !== 1) {
			// Generate fresh raw token (DB stores only its hash)
			try {
				const rawToken = await regenerateEmailVerifyToken(user.id);
				const origin = process.env.ORIGIN || 'https://temuin.web.id';
				const verifyLink = `${origin}/verify-email/${rawToken}`;
				const appName = await getSetting("app_name") || "Wedding.id";

				sendVerificationEmail(email, verifyLink, appName).catch((err) => {
					console.error('[ResendVerification] Failed to send email:', err);
				});

				logAudit({
					action: "user.resend_verification",
					userId: user.id,
					email: user.email,
					ip: clientIp,
				});
			} catch (err) {
				console.error('[ResendVerification] Failed to regenerate token:', err);
			}
		}

		return {
			success: true,
			email,
			message: "Jika email terdaftar dan belum diverifikasi, link verifikasi akan dikirim.",
		};
	},
};
