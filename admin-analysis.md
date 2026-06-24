# Admin Routes — Menu & Responsiveness Audit

Generated: 2026-05-30

## Menu Structure (from `+layout.svelte`)

| Group | Menu Name | Link |
|---|---|---|
| 📋 Kelola | Overview | `/admin` |
| 📋 Kelola | Users | `/admin/users` |
| 📋 Kelola | Undangan | `/admin/invitations` |
| 📋 Kelola | Template | `/admin/templates` |
| 💰 Bisnis | Revenue | `/admin/revenue` |
| 💰 Bisnis | Promo | `/admin/promo` |
| ⚙️ Admin | Settings | `/admin/settings` |
| ⚙️ Admin | Broadcast | `/admin/announcement` |
| ⚙️ Admin | Export | `/admin/export` |
| ⚙️ Admin | Audit Log | `/admin/audit` |
| 👤 Akun | Profile | `/admin/profile` |

Sub-pages (no direct menu link): `/admin/users/[id]`, `/admin/templates/preview/[id]`

---

## Route-by-Route Analysis

| # | Route | Menu Name | Group | Content Description | Has Responsive CSS? | Issues / Notes |
|---|---|---|---|---|---|---|
| 1 | `/admin` | Overview | 📋 Kelola | Stats cards (users, invitations, published, templates), quick-link grid, payment overview (paid/pending), pending payments table (preview), recent users table (5), recent invitations table (5) | **Partial** — `.quick-links` uses `grid auto-fit minmax(200px,1fr)`. `.overview-grid` uses `auto-fit minmax(400px,1fr)` with `@media (max-width:900px) → 1fr`. Stats row is flex (no wrap fallback). | Tables inside `.overview-grid` have 3–4 cols — OK on tablet+. No `@media` for `< 600px`. Stats row could wrap oddly on narrow screens. |
| 2 | `/admin/users` | Users | 📋 Kelola | Payment-filter chips (all/payments/paid/pending), bulk action toolbar (activate/deactivate/delete), users data-table with 10 columns incl. checkbox, username+avatar, email, role, access toggle, payment-status select, invitation-limit input, guest-limit input, delete btn, reset-password btn. Modals: add user, reset password, delete user, bulk delete. Pagination. | **Minimal** — `.payment-filter-bar` uses `flex-wrap`. `.bulk-toolbar` uses flex. Table has no responsive wrapper. | **CRITICAL**: 10-column table impossible on mobile. No horizontal scroll wrapper, no `@media` breakpoints, no col-hiding strategy. Bulk toolbar buttons could stack oddly. No max-width on filter chips container. |
| 3 | `/admin/users/[id]` | *(Users sub-page)* | 📋 Kelola | Back link, user info detail-table (email, role, access, payment_status, limits, trial, expiry, registered), action buttons (reset password, delete user), new password display. Edit access form (toggle, selects, number inputs). Invitations owned by user table (4 cols). Payment history table (5 cols). Login history table (4 cols). | **Partial** — `.dash-grid-2` collapses to 1fr at `@media (max-width:900px)`. | Three tables below the grid have no responsive treatment. On mobile they overflow. Password-display flex row could wrap. |
| 4 | `/admin/invitations` | Undangan | 📋 Kelola | Header with total count. Invitations data-table (5 cols: mempelai, slug, status, event date, actions with Edit/View/Unpublish/Hapus). Pagination. Delete modal. | **Minimal** — `.action-btns` uses `flex-wrap`. No media queries. | Table will overflow on mobile. Action buttons wrap is good but no table responsive strategy. |
| 5 | `/admin/templates` | Template | 📋 Kelola | "Template Baru" button + create modal (template ID, name, category, layout, description, colors, font, content JSON). Template grid: cards with color gradient preview, category label, name, description, layout/font meta, color swatches, Preview/Edit/Hapus actions. | **Good** — `.template-grid` uses `grid-template-columns: repeat(4,1fr)` with `@media` breakpoints: ≤1200px → 3 cols, ≤900px → 2 cols, ≤600px → 1 col. | Edit button in each card is non-functional (shows toast "Gunakan action edit via API"). Create modal has no mobile styling. Color swatches flex OK. |
| 6 | `/admin/templates/preview/[id]` | *(Template sub-page)* | 📋 Kelola | Full invitation preview: cover section (with open animation), audio toggle, couple section, event section, gallery, footer. Shows PREVIEW MODE badge and back-to-admin link. Conditionally renders different layouts (Tema31, ThreeDMotion, Khitan, Aqiqah, Birthday, Gathering, Formal, General) or inline wedding layout. | **None for admin chrome** — Preview-mode badge and back link are fixed-position. The *invitation* layouts may have their own responsive CSS (e.g., `.gallery-grid` uses `repeat(2,1fr)`, cover content `max-width:400px; width:90%`). | No admin-specific responsive. The invitation rendering components determine their own layout. Badge/back link overlap on very small screens. |
| 7 | `/admin/revenue` | Revenue | 💰 Bisnis | 4 stat cards (total revenue, transactions, success rate, fails). Monthly bar chart (6 months). Revenue-by-type table. Recent 10 transactions table (6 cols). | **Minimal** — `.stats-row` uses `grid auto-fit minmax(180px,1fr)`. Chart is flex row. No media queries. | Bar chart labels (`<span class="chart-bar-label">`) positioned absolute could overlap on narrow screens. Tables will overflow on mobile. |
| 8 | `/admin/promo` | Promo | 💰 Bisnis | Create promo toggle form (code, discount %, discount Rp, max uses, expiry date). Promos table (6 cols: code, discount, usage, expiry, status, delete action). | **Minimal** — `.form-row` uses `grid 1fr 1fr` with no breakpoint. No media queries. | `.form-row` stays 2 columns even on 320px screens — inputs will be squished. Table overflows. |
| 9 | `/admin/settings` | Settings | ⚙️ Admin | Price config (premium_price, addon_guest_price, addon_guest_quantity, template_expansion_price, template_expansion_quantity). Midtrans config (server key, client key, production toggle). App name, default music URL, payment instructions. Email templates (welcome, reset) inside `<details>`. Info card with tips. | **Good** — `.settings-grid` uses `@media (min-width:900px) → 1.5fr 1fr`. `.form-row` uses `auto-fit minmax(200px,1fr)`. | Info card is not dark-theme aware (hardcoded light colors like `#f8f9ff`, `#1e293b`). On dark admin theme it will look broken. |
| 10 | `/admin/announcement` | Broadcast | ⚙️ Admin | Warning note (rate limit). Broadcast form: target select (all/paid/unpaid), subject input, body textarea (HTML, variable `{username}`). Send button with loading state. | **None needed** — Single form card, max-width 700px, simple vertical layout. | OK as-is for responsiveness. |
| 11 | `/admin/export` | Export | ⚙️ Admin | 3 export cards (Users, Invitations, Payments) with icon, description, download button. | **Good** — `.export-grid` uses `auto-fit minmax(300px,1fr)`. | No issues. |
| 12 | `/admin/audit` | Audit Log | ⚙️ Admin | Filter bar: search input, action-category select, filter button, reset button, result count. Timeline: audit items with category color-coded left border, icon, action badge, email, relative time, details block, meta (user ID, IP, time). Pagination. Empty state. | **Excellent** — Extensive `@media (max-width:768px)` rules. Filter bar → column, filter-group → column, search-box 100%, audit-item → column, audit-header → column, audit-meta → column, pagination-bar → column. Best responsive in admin. | None. Best-practice implementation. |
| 13 | `/admin/profile` | Profile | 👤 Akun | Account info display (username, email). Change password form (current, new, confirm). | **Good** — `.profile-grid` with `@media (min-width:768px) → 1.2fr 1fr`. `max-width:900px`. | No issues. |

---

## Layout-Level Responsiveness

The admin layout (`+layout.svelte`) provides:

- **Mobile toggle button** — hidden by default, `display:block` at `@media (max-width:768px)`. Fixed position top-left.
- **Sidebar** — pushed off-canvas? Actually the `class:open={sidebarOpen}` is toggled but the sidebar itself is not positioned off-screen by default. The sidebar stays as a standard aside. On mobile (`<768px`) the `mobile-toggle` appears and a `sidebar-overlay` appears (fixed fullscreen, z-index 99). But the sidebar itself doesn't appear to slide in/out with CSS — it relies on `class:open` which is only used for JS state but no `transform` CSS is applied. **BUG**: The `.open` class exists but has no CSS rule to show/hide the sidebar on mobile. The sidebar is always visible in DOM; the overlay appears but doesn't hide the sidebar.
- **Global font size overrides** — extensive `:global()` rules to shrink text across all admin pages (h1→1.1rem, h2→0.95rem, tables→0.7rem, etc.). These ensure consistent small text but enforce it unconditionally.

**Layout responsive gap**: Sidebar doesn't actually hide on mobile — the toggle button and overlay appear but the sidebar is still visible alongside. Missing CSS like:
```css
.dash-sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s;
}
.dash-sidebar.open {
  transform: translateX(0);
}
```
(or similar off-canvas pattern)

---

## Summary of Responsiveness Issues

| Severity | Issue | Affected Pages |
|---|---|---|
| **Critical** | Table overflows on mobile — no horizontal scroll or responsive table strategy | Users (10 cols), User Detail (3 tables), Invitations (5 cols), Revenue (2 tables), Promo (6 cols) |
| **High** | Sidebar doesn't actually hide on mobile — toggle/overlay appear but sidebar stays visible | Layout (all pages) |
| **Medium** | `.form-row` 2-column grid without breakpoint — squished on <480px | Promo |
| **Medium** | Chart bar labels positioned absolute — overlap risk | Revenue |
| **Low** | Settings info card hardcoded light colors — broken on dark theme | Settings |
| **Low** | Template Edit button non-functional (toast only) | Templates |
| **Info** | Stats row (Overview) is flex — may wrap unevenly | Overview |
| **Info** | Admin badge/back link on preview page overlap on very small screens | Template Preview |

## Recommendations

1. **Add responsive table wrapper** with `overflow-x: auto` on all `<table class="dash-table">` containers.
2. **Fix sidebar off-canvas** — add `transform: translateX(-100%)` on mobile with `transition`, toggled by `.open` class.
3. **Add `@media (max-width:480px)` breakpoint** for `.form-row` to collapse to 1 column on promo and similar forms.
4. **Refactor stat row** (overview) from flexbox to CSS grid for consistent wrapping.
5. **Fix Settings info card** — use CSS variables instead of hardcoded light colors, or detect theme.
6. **Implement template editing** or remove the fake Edit button.
