# Global CSS Responsive Design Analysis

## 1. Breakpoints Found (via @media queries)

| Breakpoint | Direction | Files Using |
|---|---|---|
| **480px** | max-width | `InvitationHero.svelte`, `demo/[id]/+page.svelte` |
| **600px** | max-width | `InvitationCouple.svelte`, `InvitationEvent.svelte`, `InvitationGallery.svelte`, `InvitationGift.svelte`, `dashboard/+page.svelte`, `dashboard/create/+page.svelte`, `dashboard/invitations/[id]/+page.svelte`, `admin/templates/+page.svelte`, `demo/[id]/+page.svelte` |
| **600px** | min-width | `InvitationGallery.svelte`, `InvitationGift.svelte`, `dashboard/create/+page.svelte`, `dashboard/invitations/[id]/+page.svelte`, `demo/[id]/+page.svelte` |
| **700px** | max-width | `dashboard/create/+page.svelte`, `dashboard/invitations/[id]/+page.svelte` |
| **720px** | max-width | `Tema31InspiredWedding.svelte` |
| **768px** | max-width | `app.css` (global), `Tema31InspiredWedding.svelte`, `admin/+layout.svelte`, `admin/audit/+page.svelte`, `dashboard/+layout.svelte` |
| **768px** | min-width | `InvitationEvent.svelte`, `admin/profile/+page.svelte`, `dashboard/profile/+page.svelte`, `dashboard/billing/+page.svelte`, `demo/[id]/+page.svelte` |
| **900px** | max-width | `admin/+page.svelte`, `admin/templates/+page.svelte`, `admin/users/[id]/+page.svelte` |
| **900px** | min-width | `+page.svelte` (homepage) |
| **1024px** | min-width | `dashboard/billing/+page.svelte` |
| **1200px** | max-width | `admin/templates/+page.svelte` |

### Implied Breakpoint Ranges

```
Mobile-first stack:
- < 480px   (small phones)
- 480-599px (phones)
- 600-767px (large phones / small tablets)
- 768-899px (tablets)
- 900-1023px (small desktops)
- 1024-1199px (medium desktops)
- 1200px+   (large desktops)
```

No CSS custom properties store these breakpoint values. No shared config defines them.

---

## 2. CSS Custom Properties for Responsive Design

**None.** All custom properties in `:root` (`app.css`) serve:

- Color system
- Typography (fonts)
- Spacing scale (`--space-xs` through `--space-4xl`)
- Border radius scale
- Shadow scale
- Transition timing

No `--bp-*`, `--breakpoint-*`, `--viewport-*`, or `--screen-*` variables exist.

No custom property overrides inside `@media` blocks — spacing, radius, typography sizes are **static** across breakpoints.

---

## 3. Responsive Utility Classes

### Global (app.css)

| Class | Rule | Notes |
|---|---|---|
| `.container` | `max-width: 1200px; margin: 0 auto; padding: 0 var(--space-lg)` | Fixed max-width, no breakpoint change |
| `.text-center` | `text-align: center` | Non-responsive |

### Component-Level Utility Patterns (not in app.css, found in components)

| Class | Location | Behavior |
|---|---|---|
| `.dash-grid-2` | `routes/admin/users/[id]/+page.svelte` | `grid-template-columns: 1fr 1fr` → collapses to `1fr` at `max-width: 900px` |
| `.mobile-toggle` | `admin/+layout.svelte`, `dashboard/+layout.svelte` | Hidden by default (`display: none`), shown at `max-width: 768px` |

### No Responsive Visibility Classes

No `.hide-mobile`, `.show-mobile`, `.hide-desktop`, `.show-tablet` utility classes exist globally. Mobile toggling is done per-component via scoped `.mobile-toggle` blocks.

---

## 4. Responsive Grid Patterns (app.css)

```css
.dash-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--space-lg);
}
```

Uses **auto-fit + minmax** pattern — naturally responsive without media queries. Collapses to `1fr` at `768px` via explicit override.

---

## 5. Global `@media (max-width: 768px)` Block (app.css)

This is the **only** global responsive block. Changes:

| Element | Mobile (≤768px) |
|---|---|
| `.dash-sidebar` | `transform: translateX(-100%)` (hidden off-screen). `.open` → `translateX(0)` |
| `.dash-main` | `margin-left: 0` (full width) |
| `.dash-stats` | `grid-template-columns: 1fr` (single column) |
| `.dash-table` | `display: block; overflow-x: auto` (horizontal scroll) |

---

## 6. svelte.config.js & vite.config.ts

**No responsive configuration.** Files contain only:

- **svelte.config.js**: SvelteKit adapter config, runes mode enforcement
- **vite.config.ts**: Plugin setup, dev server port/host/allowedHosts, watch ignores

---

## 7. Summary of Gaps

1. **No centralized breakpoint map** — breakpoints are scattered across 20+ component files as inline magic numbers
2. **No responsive custom properties** — spacing, typography, layout values don't change with viewport
3. **No responsive utility classes** — no global hide/show per breakpoint, no responsive grid column classes
4. **Single global media query** — only `768px` max-width is centralized in `app.css`
5. **Component-scoped overrides** — each component duplicates its own `@media` blocks, making consistent changes difficult
