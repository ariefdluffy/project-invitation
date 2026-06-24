# Dashboard Route Audit — Menu & Responsiveness

Date: 2026-05-30

## Menu Structure (from `+layout.svelte` sidebar)

| # | Menu Name         | Route                      | Icon SVG | Conditional? |
|---|-------------------|----------------------------|----------|-------------|
| 1 | Dashboard         | `/dashboard`               | House    | No          |
| 2 | Buat Undangan     | `/dashboard/create`        | Plus circle | No        |
| 3 | Undangan Saya     | `/dashboard/invitations`   | File     | No          |
| 4 | Media & Foto      | `/dashboard/media`         | Image    | No          |
| 5 | Billing & Akses   | `/dashboard/billing`       | Credit card | No       |
| 6 | My Profile        | `/dashboard/profile`       | User     | `{#if data.user}` |

**Not in sidebar (orphan routes):**
- `/dashboard/billing/checkout` — sub-page of billing flow
- `/dashboard/invitations/[id]` — dynamic detail/edit page
- `/dashboard/import-guests` — no menu link exists

---

## Per-Route Audit

| Route | Menu Name | Content Description | Has Responsive CSS? | Issues/Notes |
|-------|-----------|-------------------|---------------------|-------------|
| `/dashboard` | **Dashboard** | Welcome header, analytics cards (views/visitors/RSVP), activation warning banner, stat cards (invitations/attendance), recent invitations list with edit/preview links | **Yes** — `@media (max-width: 600px)` for analytics grid (→ 1fr) and invitation items (→ column) | Banner `slideInDown` animation only. Mobile toggle button present in layout overlay. Stats grid uses no explicit breakpoint but only 4 items, works. |
| `/dashboard/create` | **Buat Undangan** | Multi-step form: (1) Template selector w/ category filter + preview modal, (2) Bride/groom/event data (dynamic labels by category), (3) Event details (dates, venue), (4) Additional details (quote, music, media URLs, bank accounts, dress colors) | **Yes** — `@media (max-width: 700px)` for `.form-row` (→ 1col) and `.bank-row` (→ 1col). `@media (min-width: 600px)` for step labels. | Template grid uses `auto-fit, minmax(280px, 1fr)` — responsive. Preview modal fixed position with backdrop. Long page but well-broken. |
| `/dashboard/invitations` | **Undangan Saya** | Card grid of user's invitations showing status (draft/published), couple names, slug, event date, action buttons (manage/duplicate/preview). Empty state and limit-reached banner. Trial expiry banner. | **Partial** — Grid uses `auto-fill, minmax(320px, 1fr)` which auto-responsive. No explicit media query breakpoints. | Cards stack fine on mobile via auto-fill. No `@media` blocks at all. `.trial-expired-banner` has no breakpoint adjustments — fine at mobile width. |
| `/dashboard/invitations/[id]` | _(not in sidebar — reached from card links)_ | Full invitation editor with 5 tabs: Detail (template selector, bride/groom data, event dates, venue, media, love story), Text (custom content), Guests (add/search/copy link/delete), Wishes (list w/ attendance badge), Settings (delete with confirmation modal). Stats section at top. | **Yes** — `@media (max-width: 700px)` for `.form-row` (→ 1col). `@media (min-width: 600px)` for guest toolbar (row layout). | Stats grid uses `auto-fit, minmax(140px, 1fr)` — responsive. Tabs bar flex/gap no breakpoint — may overflow on very small screens (<360px). Photo preview grid uses flex-wrap. |
| `/dashboard/media` | **Media & Foto** | File upload (drag-drop area, file preview, progress bar with XHR upload), gallery grid of uploaded images with name/size, copy URL and delete buttons. Delete confirmation modal. | **Partial** — Gallery grid uses `auto-fill, minmax(140px, 1fr)` — responsive. No explicit media query breakpoints. | Upload section flex-column — stacks fine. `.gallery-section` heading has no breakpoint. Progress bar full-width. Delete modal fixed backdrop — fine on mobile. No `.dash-header-sub` breakpoints. |
| `/dashboard/billing` | **Billing & Akses** | Status card (payment status badge + access panel + CTA), trial banner, premium package card (features list, price, subscribe button), add-on guest card, manual payment card with WhatsApp link + instructions | **Yes** — `@media (min-width: 768px)` billing grid → 2col, `@media (min-width: 1024px)` → 3col. Trial banner spans full grid. | Cards use linear-gradient backgrounds and fixed color values (not CSS vars) — may break on dark/light theme switch. Manual payment card uses white backgrounds. |
| `/dashboard/billing/checkout` | _(not in sidebar — linked from billing)_ | Checkout card with: back link, Midtrans Snap integration, promo code form, order summary (package, description, order ID, discount, total), trust badges, pay button. Error state display. | **Partial** — Single-column layout, max-width 440px container centered. No explicit media queries. | Naturally responsive due to max-width + padding. Pay button full-width. Promo form uses flex — may wrap on <360px. Summary rows stack on very narrow screens w/ gaps. No breakpoint issues. |
| `/dashboard/profile` | **My Profile** | Account info card (username, email, payment status, invitation limit, guest limit, template quota) and password change form (current/new/confirm password). | **Yes** — `@media (min-width: 768px)` profile grid → 2col (1.2fr 1fr). | Password form uses `use:enhance` with toast feedback. Info badges use hardcoded color classes (unpaid=red, paid=green, etc.) — hard to theme. |
| `/dashboard/import-guests` | _(not in sidebar — no menu link)_ | Simple CSV import page: back link to invitations list, format info box, textarea for bulk names (comma/semicolon/tab/newline separated), import + cancel buttons. | **No** — No media queries at all. | Standalone layout with `#f5f5f5` background (not dashboard theme). Uses hardcoded colors (`#d4a574`, `#1a1a2e`, `#666`). Inconsistent with rest of dashboard which uses CSS vars. No sidebar/layout integration — feels like a legacy page. Missing from sidebar menu entirely. |

---

## Summary

### Routes with full responsive CSS
- `/dashboard` ✓
- `/dashboard/create` ✓
- `/dashboard/invitations/[id]` ✓
- `/dashboard/billing` ✓
- `/dashboard/profile` ✓

### Routes with partial responsive CSS (auto-fill grids, no breakpoints)
- `/dashboard/invitations` — works but no explicit breakpoints
- `/dashboard/media` — works but no explicit breakpoints
- `/dashboard/billing/checkout` — works due to single-column + max-width

### Routes with NO responsive CSS
- `/dashboard/import-guests` — standalone page, no breakpoints, inconsistent theme

### Orphan routes (not linked from sidebar)
- `/dashboard/billing/checkout` — known sub-page, fine
- `/dashboard/invitations/[id]` — dynamic editor, fine
- `/dashboard/import-guests` — **missing menu link** — should be added to sidebar or invitations page

### Inconsistency found
- `import-guests/+page.svelte` uses hardcoded colors and standalone layout — likely an older page. All other dashboard pages use `--dash-*` CSS variables and `dash-card`, `dash-header`, `btn` classes.
