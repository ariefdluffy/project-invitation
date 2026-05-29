import type { Actions } from './$types';
import { fail, redirect } from "@sveltejs/kit";
import { authenticateUser } from "$lib/server/users";
import { createSessionToken } from "$lib/server/session";
import { logAudit } from "$lib/server/audit-log";
import { SECRET_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";

/**
 * Cloudflare Turnstile test keys.
 * Site key: 1x00000000000000000000AA → selalu render widget, auto-pass
 * Secret key: 1x0000000000000000000000000000000AA → selalu return success
 */
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

async function verifyTurnstile(token: string, secretKey: string): Promise<{ success: boolean; errorCodes?: string[] }> {
	const params = new URLSearchParams({
		secret: secretKey,
		response: token,
	});
	const res = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params.toString(),
		}
	);
	const data = await res.json() as { success: boolean; 'error-codes'?: string[] };
	return { success: data.success, errorCodes: data['error-codes'] };
}

/**
 * Tentukan secret key yang efektif:
 * - Jika SITE_KEY adalah test key → pakai test secret (widget test key hanya valid dengan test secret)
 * - Jika SECRET_KEY tidak diset → pakai test secret
 * - Selainnya → pakai SECRET_KEY dari env
 */
function getEffectiveSecret(): string {
	if (!SECRET_KEY || SECRET_KEY.trim() === TURNSTILE_TEST_SECRET) return TURNSTILE_TEST_SECRET;
	return SECRET_KEY.trim();
}

export const actions: Actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const turnstileResponse = formData.get("cf-turnstile-response") as string;

    if (!email || !password) {
      return fail(400, { error: "Email dan password harus diisi", email });
    }

    // Rate limiting by IP + email
    const clientIp = getClientAddress();
    const rlResult = checkRateLimit(ipKey(clientIp, "login"), {
      maxRequests: 5,
      windowMs: 60 * 1000,
    });
    if (!rlResult.allowed) {
      return fail(429, {
        error:
          "Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.",
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
      const result = await verifyTurnstile(turnstileResponse, getEffectiveSecret());

      if (!result.success) {
        console.error('Turnstile verification failed:', result.errorCodes);
        if (dev && result.errorCodes?.includes('invalid-input-response')) {
          console.warn('[Dev] Bypassing Turnstile verification failure in dev mode. This should NEVER happen in production.');
        } else {
          return fail(400, {
            error: "Gagal memverifikasi bahwa Anda bukan robot. Silakan refresh halaman dan coba lagi.",
            email,
          });
        }
      }
    } catch (err) {
      console.error("Error verifying Turnstile:", err);
      return fail(500, {
        error: "Terjadi kesalahan sistem saat verifikasi keamanan.",
        email,
      });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return fail(400, { error: "Email atau password salah", email });
    }

    // Set signed session cookie
    const sessionToken = createSessionToken(user.id);

    // Audit log (fire and forget)
    logAudit({
      action: "user.login",
      userId: user.id,
      email: user.email,
      ip: getClientAddress(),
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
};
