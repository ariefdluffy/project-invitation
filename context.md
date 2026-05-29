# Code Context — Admin Feature Audit

## Files Retrieved

1. `src/routes/admin/invitations/+page.server.ts` (lines 1-62) — Admin invitation list: only delete + unpublish actions. Edit link goes to user dashboard.
2. `src/routes/admin/invitations/+page.svelte` (lines 1-160) — UI: table with edit (redirect to /dashboard/), view, unpublish, delete buttons. No inline edit.
3. `src/routes/admin/users/+page.server.ts` (lines 1-195) — Admin user list: addUser, updateAccess, delete, resetPassword actions.
4. `src/routes/admin/users/+page.svelte` (lines 1-400) — User table: per-row forms for access toggle, payment status, limits. No checkboxes, no bulk actions.
5. `src/routes/admin/templates/+page.server.ts` (lines 1-8) — Template list: only load + render. No CRUD actions.
6. `src/routes/admin/templates/+page.svelte` (lines 1-85) — Template grid: view-only with preview link. No create/edit/delete UI.
7. `src/routes/admin/templates/preview/[id]/+page.server.ts` (lines 1-120) — Template preview with dummy data.
8. `src/routes/admin/+page.svelte` (lines 1-190) — Admin overview: stats cards, user/invitation tables. No revenue/chart dashboard.
9. `src/routes/admin/+layout.server.ts` (lines 1-85) — Admin layout: loads users, invitations, templates, monitoring stats. No chart/revenue data beyond counts.
10. `src/routes/admin/+layout.svelte` (lines 1-180) — Admin sidebar navigation. Links: Overview, Users, Undangan, Template, Settings, Promo Codes, Audit Logs, My Profile.
11. `src/routes/admin/settings/+page.server.ts` (lines 1-70) — App settings: pricing, Midtrans, app name, payment instructions. No email template settings.
12. `src/routes/admin/settings/+page.svelte` (lines 1-220) — Settings form: price fields, Midtrans config, app name, default music URL, payment instructions.
13. `src/routes/admin/promo/+page.server.ts` (lines 1-45) — Promo codes CRUD (create/delete). Standalone feature.
14. `src/routes/admin/audit/+page.server.ts` (lines 1-25) — Audit log viewer with pagination and search.
15. `src/routes/admin/audit/+page.svelte` (lines 1-330) — Audit log UI: search, category filter, timeline view, pagination.
16. `src/routes/api/monitoring/+server.ts` (lines 1-60) — Monitoring API: user/invitation/payment/audit counts, revenue sum. JSON only, no chart.
17. `src/lib/server/email.ts` (lines 1-165) — Email sender: sendPasswordResetEmail, sendWelcomeEmail. Templates hardcoded, no admin UI for editing.
18. `src/lib/server/users.ts` (lines 1-230) — User functions: CRUD, password reset, forgot-password token flow, access expiry.
19. `src/lib/server/audit-log.ts` (lines 1-85) — Audit log system: tracks user.login, invitation.*, payment.*, admin.* actions. getAuditLogsByUser() exists.
20. `src/lib/server/invitations.ts` (lines 1-330) — Invitation CRUD, template loading from filesystem (`static/templates/`).
21. `src/lib/server/payment-transactions.ts` (lines 1-120) — Payment transaction CRUD.
22. `src/routes/forgot-password/+page.server.ts` (lines 1-100) — Forgot-password: Turnstile → token → sendPasswordResetEmail.
23. `src/routes/reset-password/[token]/+page.server.ts` (lines 1-50) — Reset-password: verify token → update password.
24. `src/routes/dashboard/import-guests/+page.server.ts` (lines 16-60) — CSV import for guests (user dashboard only). No CSV export.

---

## Feature Status Report

### 1. Edit undangan dari admin panel — SEBAGIAN (view-only, no inline edit)
Admin can LIST invitations, DELETE, UNPUBLISH, and VIEW (public page). Edit link (`/dashboard/invitations/{id}`) redirects to USER's own dashboard, not an admin-controlled editor. No admin-side form to edit invitation content (bride/groom names, dates, venue, etc.) directly from admin panel.

Files: `src/routes/admin/invitations/+page.server.ts`, `src/routes/admin/invitations/+page.svelte`

### 2. Export data CSV — BELUM ADA
No CSV export anywhere in admin panel. No export for users, invitations, or payments. CSV import exists only for guests in user dashboard (`/dashboard/import-guests`). No download buttons or API endpoints for CSV generation.

### 3. Revenue dashboard — SEBAGIAN (raw stats only, no chart)
Admin overview page shows basic counts: total users, paid/pending users, total invitations, published count. Monitoring API (`/api/monitoring`) returns revenue sum as JSON number. But NO dedicated revenue dashboard with charts, graphs, monthly/periodic breakdown, or payment visualization.

Files: `src/routes/admin/+page.svelte`, `src/routes/api/monitoring/+server.ts`

### 4. Bulk actions (bulk activate/delete users) — BELUM ADA
User table has per-row forms with individual inputs for access toggle, payment status, limits, delete, reset password. No checkbox column, no select-all, no bulk action toolbar. Each action requires individual form submission.

Files: `src/routes/admin/users/+page.svelte`, `src/routes/admin/users/+page.server.ts`

### 5. Email template management — BELUM ADA
Email content for password reset and welcome is hardcoded in `src/lib/server/email.ts`. Admin settings page (`/admin/settings`) only handles app config, pricing, Midtrans. No UI to edit email subject, body, HTML templates, or sender info. SMTP config is env-var only.

### 6. User detail page — BELUM ADA
No route like `/admin/users/[id]`. Admin users page is flat table with all users. Cannot view a single user's:
- Invitations list
- Payment history
- Activity log (though audit log has per-user query capability: `getAuditLogsByUser()` exists in `audit-log.ts` line 70)
- Current plan/limits in a dedicated detail view

### 7. Announcement/broadcast — BELUM ADA
No feature to send announcements or broadcast emails to all users. No admin page for composing/sending mass messages. No notification system found.

### 8. Template management CRUD — SEBAGIAN (view + preview only)
Admin can VIEW template list (cards with colors/font info) and PREVIEW (guest-facing page with dummy data). But NO create, edit, or delete template from UI. Templates are loaded from filesystem (`static/templates/` dir) and managed via `seedTemplates()` in `invitations.ts`. No database-backed CRUD UI.

Files: `src/routes/admin/templates/+page.svelte`, `src/routes/admin/templates/+page.server.ts`, `src/routes/admin/templates/preview/[id]/+page.server.ts`

### 9. Login history per user — SEBAGIAN (audit log exists, no dedicated per-user page)
Audit log system (`audit-log.ts`) tracks `user.login` events with user_id, email, IP, timestamp. General audit log viewer (`/admin/audit`) has search/filter by action category. The function `getAuditLogsByUser(userId)` exists but has NO dedicated UI. No per-user login history page showing logins, IPs, timestamps for a specific user.

Files: `src/lib/server/audit-log.ts`, `src/routes/admin/audit/+page.svelte`

### 10. Reset password via email — SUDAH ADA (user flow), admin reset does NOT email user
User-initiated forgot-password flow exists end-to-end:
- `/forgot-password` — form with Turnstile → generates token → `sendPasswordResetEmail()` → user clicks link → `/reset-password/[token]` → enters new password
- Rate-limited (3 req/min)
- Token expires 1 hour

However, admin panel's `resetPassword` action (line 170 in users/+page.server.ts) generates random password and SHOWS IT IN TOAST to admin. Does NOT send email to user. No `sendPasswordResetEmail()` call in admin reset flow.

Files: `src/routes/forgot-password/+page.server.ts`, `src/routes/reset-password/[token]/+page.server.ts`, `src/routes/admin/users/+page.server.ts`

---

## Architecture Overview

**Stack**: SvelteKit (fullstack) + MySQL (via mysql2) + Nodemailer (SMTP)

**Pattern**: SvelteKit form actions (POST) for data mutations, server load functions for data fetching. No dedicated API routes for admin features — admin actions are form actions on the page server files.

**Key data flow**: Admin pages → form action → server function → MySQL → return result → client toast. No REST API abstraction for admin operations.

**Auth**: `locals.user` set in hooks, role check (`locals.user.role !== 'admin'`) at top of every admin load/action.

**Missing patterns**: No component library reuse for admin (all table/form styles inline in Svelte `<style>` tags). No admin API layer. Monitoring is JSON API only.

## Start Here
Open `src/routes/admin/users/+page.server.ts` — it shows the admin action pattern used across all features and reveals what's NOT there (bulk actions, per-user detail, etc.). Then check `src/routes/admin/invitations/+page.server.ts` to see invitation management gap (no edit).
