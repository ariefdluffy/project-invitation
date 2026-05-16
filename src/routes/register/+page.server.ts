import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { createUser } from "$lib/server/users";
import { createSessionToken } from "$lib/server/session";
import { logAudit } from "$lib/server/audit-log";
import { SECRET_KEY } from "$env/static/private";
import { dev } from "$app/environment";
import { checkRateLimit, ipKey } from "$lib/server/rate-limiter";
import { sendWelcomeEmail } from "$lib/server/email";
import { getSetting } from "$lib/server/settings";

export const actions: Actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const turnstileResponse = formData.get("cf-turnstile-response") as string;

    if (!username || !email || !password) {
      return fail(400, { error: "Semua field harus diisi", username, email });
    }

    if (password.length < 6) {
      return fail(400, {
        error: "Password minimal 6 karakter",
        username,
        email,
      });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: "Password tidak cocok", username, email });
    }

    // Rate limiting by IP
    const clientIp = getClientAddress();
    const rlResult = checkRateLimit(ipKey(clientIp, "register"), {
      maxRequests: 3,
      windowMs: 60 * 1000,
    });
    if (!rlResult.allowed) {
      return fail(429, {
        error:
          "Terlalu banyak permintaan daftar. Silakan coba lagi dalam 1 menit.",
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

      // Audit log + trial info (fire and forget)
      logAudit({
        action: "user.register",
        userId: user.id,
        email: user.email,
        details: "3-day trial started",
        ip: getClientAddress(),
      });

      // Set signed session
      const sessionToken = createSessionToken(user.id);
      cookies.set("session", sessionToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: !dev,
        maxAge: 60 * 60 * 24 * 7,
      });

      // Send welcome email (async, don't block)
      getSetting("app_name")
        .then((appName) => {
          sendWelcomeEmail(email, username, appName || "Wedding.id");
        })
        .catch(() => {});

      throw redirect(303, "/dashboard");
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
