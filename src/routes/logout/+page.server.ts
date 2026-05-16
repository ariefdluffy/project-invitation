import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { verifySessionToken } from "$lib/server/session";
import { logAudit } from "$lib/server/audit-log";

export const actions: Actions = {
  default: async ({ cookies }) => {
    // Read session before deleting
    const sessionCookie = cookies.get("session");
    let userId: string | null = null;
    if (sessionCookie) {
      const payload = verifySessionToken(sessionCookie);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Audit log (fire and forget)
    if (userId) {
      logAudit({
        action: "user.logout",
        userId,
        ip: "",
      });
    }

    // Delete session cookie with same options as set
    cookies.delete("session", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: !dev,
    });
    cookies.set(
      "flash",
      JSON.stringify({
        id: crypto.randomUUID(),
        type: "success",
        message: "Logout berhasil.",
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: !dev,
      },
    );
    throw redirect(303, "/");
  },
};
