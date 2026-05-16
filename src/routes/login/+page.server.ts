import type { Actions } from "./";
import { fail, redirect } from "@sveltejs/kit";
import { authenticateUser } from "$lib/server/users";
import { createSessionToken } from "$lib/server/session";
import { logAudit } from "$lib/server/audit-log";
import { SECRET_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";

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
      const params = new URLSearchParams({
        secret: SECRET_KEY,
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
