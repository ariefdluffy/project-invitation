import type { Handle } from "@sveltejs/kit";
import {
  seedTemplates,
  seedAdmin,
  seedSettings,
} from "$lib/server/invitations";
import {
  getUserById,
  ensureResetTokenColumns,
  ensureTrialColumn,
  ensureEmailVerifyColumns,
  ensureSubscriptionEndsAtColumn,
} from "$lib/server/users";
import { ensurePaymentTransactionsTable } from "$lib/server/payment-transactions";
import { verifySessionToken } from "$lib/server/session";
import { ensureSessionsTable } from "$lib/server/session-store";
import { ensurePackagesTable, seedPackages } from "$lib/server/packages";
import { ensurePromoCodesTable } from "$lib/server/promo-codes";
import { ensurePageViewsTable } from "$lib/server/analytics";
import { ensureAuditLogsTable } from "$lib/server/audit-log";
import { ensureWebhookQueueTable } from "$lib/server/webhook-queue";
import { ensureFailedLoginColumns } from "$lib/server/account-lockout";
import { ensureBackgroundJobsTable, startJobWorker } from "$lib/server/job-queue";
import { registerAllJobHandlers } from "$lib/server/job-handlers";
import { dev } from "$app/environment";
import crypto from "crypto";

let seeded = false;

export const handle: Handle = async ({ event, resolve }) => {
  // Seed database on first request
  if (event.url.searchParams.has("reseed")) {
    seeded = false;
  }

  if (!seeded) {
    console.log("[Server] Seeding database templates and settings...");
    await seedTemplates();
    await seedSettings();
    await seedAdmin();
    await ensurePaymentTransactionsTable();
    await ensureResetTokenColumns();
    await ensureTrialColumn();
    await ensureEmailVerifyColumns();
    await ensurePackagesTable();
    await seedPackages();
    await ensurePromoCodesTable();
    await ensurePageViewsTable();
    await ensureAuditLogsTable();
    await ensureSessionsTable();
    await ensureWebhookQueueTable();
    await ensureFailedLoginColumns();
    await ensureSubscriptionEndsAtColumn();
    await ensureBackgroundJobsTable();
    registerAllJobHandlers();
    startJobWorker();
    seeded = true;
  }

  // Generate per-request CSP nonce (used for inline scripts/styles where unavoidable)
  const nonce = crypto.randomBytes(16).toString("base64");
  event.locals.cspNonce = nonce;

  // Get session from signed cookie
  const sessionCookie = event.cookies.get("session");
  if (sessionCookie) {
    const payload = await verifySessionToken(sessionCookie);
    if (payload) {
      const user = await getUserById(payload.userId);
      if (user) {
        event.locals.user = user;
      } else {
        // User deleted but cookie still valid - delete cookie
        event.cookies.delete("session", { path: "/" });
      }
    } else {
      // Invalid/expired/revoked session - delete cookie
      event.cookies.delete("session", { path: "/" });
    }
  }

  // Protect admin routes
  if (event.url.pathname.startsWith("/admin")) {
    if (!event.locals.user || event.locals.user.role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: { location: "/login" },
      });
    }
  }

  // Protect dashboard routes
  if (event.url.pathname.startsWith("/dashboard")) {
    if (!event.locals.user) {
      return new Response(null, {
        status: 302,
        headers: { location: "/login" },
      });
    }
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace(/%csp_nonce%/g, nonce),
  });

  // Build Content Security Policy.
  // - In dev we relax script-src so Vite HMR (which uses inline scripts and eval)
  //   keeps working. We must NOT include a nonce here, because the CSP spec says
  //   `'unsafe-inline'` is ignored whenever a nonce/hash is also listed, which
  //   would block Vite's HMR scripts and SvelteKit hydration scripts.
  // - The strict policy (with nonce + strict-dynamic) is used for production
  //   builds where SvelteKit injects nonces on its own script tags.
  const scriptSrc = dev
    ? `'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com`;

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://challenges.cloudflare.com https://*.cloudflare.com https://images.unsplash.com https://*.unsplash.com https://res.cloudinary.com https://*.cloudinary.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://static.cloudflareinsights.com",
    "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Additional hardening headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  );
  if (!dev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
};
