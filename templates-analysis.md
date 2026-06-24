# Invitation Template Components – Responsiveness Analysis

## Layout Components (`src/lib/components/invitations/`)

| Component | Type | Has Responsive CSS? | Issues/Notes |
|---|---|---|---|
| **AqiqahLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Pure config proxy → delegates to SimpleEventLayout. No own CSS. |
| **BirthdayLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Same pattern as AqiqahLayout. Config-only proxy. |
| **FormalLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Same pattern. Config-only proxy. |
| **GatheringLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Same pattern. Config-only proxy. |
| **GeneralLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Same pattern. Config-only proxy. |
| **KhitanLayout.svelte** | Layout (thin wrapper) | N/A (delegates) | Same pattern. Config-only proxy. |
| **SimpleEventLayout.svelte** | Layout (full) | **Partial** – uses `clamp()` for hero title, `repeat(auto-fit, minmax(...))` for grids, `%`/`max-width` for widths, `rem` for spacing. Cover uses `90%` + `max-width: 420px`. | **No `@media` breakpoints.** Relies entirely on CSS intrinsic layout (`auto-fit`, `clamp()`). Cover card width could overflow on very small screens (<320px). No touch-target sizing for mobile. Fixed-position cover ignores keyboard/mouse. |
| **Tema31InspiredWedding.svelte** | Layout (full) | **Good** – `clamp()` on hero/cover titles. `width: min(480px, 92%)` for cover-card. `@media (max-width: 720px)` for cover-title column flex. `@media (max-width: 768px)` toned-down scroll animation displacement. `repeat(auto-fit, minmax(...))` on grids. | `useAnimations` flag defaults `false` (no scroll animations unless explicitly toggled). Petal float animations don't respond to `prefers-reduced-motion`. Background image `::before` pseudo-element may overlap content on some viewports. |
| **ThreeDMotionWedding.svelte** | Layout (full) | **Partial** – `clamp()` on titles. `width: min(480px, 92%)` for cover-card. `repeat(auto-fit, minmax(...))` grids. `flex-wrap: wrap` on hero-title. Orb float animations use `@keyframes`. | **No `@media` breakpoints.** No `prefers-reduced-motion` handling for orb/grid animations. Dark theme only – no contrast adjustments for varying ambient light. `.neon-grid` background-size `120px` fixed (not viewport-relative). |

---

## Building Block Components (`src/lib/components/invitation/`)

| Component | Type | Has Responsive CSS? | Issues/Notes |
|---|---|---|---|
| **InvitationCouple.svelte** | Building block | **Basic** – `@media (max-width: 600px)` reduces card padding. Uses flex column (stacks vertically naturally). | Avatar fixed `180px` (doesn't scale down on mobile). `@media` only adjusts padding, not image sizing. |
| **InvitationCover.svelte** | Building block | **Basic** – `90%` width + `max-width: 400px` for cover-content. Fixed full-viewport cover section. | **No `@media` breakpoints.** Cover font sizes use raw `2.8rem` (no `clamp()`). On small screens names may overflow. `.cover-content::before` inset border may clip on very narrow screens. |
| **InvitationDress.svelte** | Building block | **Minimal** – Flexbox row (wraps on overflow). | **No `@media` breakpoints.** Color circles fixed at `60px` (too large on small screens, maybe fine). No label text for screen readers. |
| **InvitationEvent.svelte** | Building block | **Good** – `@media (min-width: 768px)` switches event-cards to 2-column grid. `@media (max-width: 600px)` forces 1-column. Template variants use `auto-fit`. | Map iframe `height: 200px` fixed (might be tall on mobile but acceptable). |
| **InvitationFooter.svelte** | Building block | **Minimal** – Uses `rem`/`%` units. | **No `@media` breakpoints.** Hard-coded `max-width: 80%` on footer static text (may look odd on very wide screens). `inline-style` heavy (not ideal for maintainability). |
| **InvitationGallery.svelte** | Building block | **Good** – `@media (min-width: 600px)` switches grid from 2-col to 3-col. `aspect-ratio: 1/1` keeps items square. | No `prefers-reduced-motion` for hover scale transform. Item `border: 3px solid rgba(255,255,255,0.9)` adds extra visual weight. |
| **InvitationGift.svelte** | Building block | **Good** – `@media (min-width: 600px)` switches from 1-col to `auto-fit` minmax(250px). | Good use of `auto-fit`. No touch-action optimization for copy button on mobile. |
| **InvitationHero.svelte** | Building block | **Good** – `@media (max-width: 480px)` reduces countdown gap/padding/font. `clamp()` for names (3rem–8vw–4.5rem). `max-width: 600px` hero-box. Countdown uses 4-col grid. | Countdown items might compress on very small screens (<320px) despite the breakpoint. `min-height: 100vh` with flex center works for mobile but could cause content jump with different browser chrome (mobile address bar). |
| **InvitationLayoutStyles.svelte** | Building block (CSS-only) | **None** – Pure global style overrides per template theme. | No layout or responsive rules. Expected – it's a theme variant stylesheet. |
| **InvitationQuote.svelte** | Building block | **None** – Basic flex column. Icon + text stack. | No `@media`. Quote icon `40px` fixed. Works because content is minimal. |
| **InvitationRsvp.svelte** | Building block | **Basic** – Uses `%` width on form inputs, `max-height: 400px` scroll for wishes list. | **No `@media` breakpoints.** Input padding `1.2rem` may be large on mobile but acceptable (better for touch). `.wishes-scroll` max-height fixed – on mobile with many wishes it's ok. |
| **InvitationSharedStyles.svelte** | Building block (CSS-only) | **Partial** – `.section` uses `max-width: 800px` + `padding: 5rem 1.5rem` (scales down with relative units). `.reveal` animation transitions defined. | **No `@media` breakpoints.** Section padding `5rem` top/bottom may be excessive on mobile (could use media query to reduce). |
| **InvitationStory.svelte** | Building block | **Minimal** – Text wraps naturally. Uses `max-width` via `.section` from shared styles. | **No `@media` breakpoints.** No special handling for long text on small screens. |

---

## Summary

- **6 layout wrappers** (Aqiqah, Birthday, Formal, Gathering, General, Khitan) are pure config proxies → responsiveness depends entirely on SimpleEventLayout.
- **SimpleEventLayout** has partial responsive design (relies on `clamp()`/`auto-fit`/relative units) but **lacks `@media` breakpoints**.
- **Tema31InspiredWedding** has the best responsive CSS among layouts (includes 2 breakpoints).
- **ThreeDMotionWedding** has partial responsive CSS (no breakpoints, but fluid units).
- **Building blocks** vary widely: InvitationEvent, InvitationGallery, InvitationGift, InvitationHero have good breakpoints. InvitationCover, InvitationCouple, InvitationFooter, InvitationRsvp have minimal/no breakpoints.
- **Common issues across components:**
  - No `prefers-reduced-motion` media query for animations
  - No touch-target sizing guidance (min 44×44px)
  - Many components lack `@media` breakpoints, relying solely on relative units
  - Fixed-position cover sections don't account for mobile browser chrome
  - No print stylesheets
