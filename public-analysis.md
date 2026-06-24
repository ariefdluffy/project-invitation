# Responsiveness Audit — Public/Auth/Special Routes

Audit date: 2026-05-30

---

## Global CSS (`src/app.css`)

| Aspect | Details |
|--------|---------|
| Responsive utilities | Minimal. One `@media (max-width: 768px)` for dashboard sidebar (hides sidebar, full-width main, single-column stats, scrollable table). |
| Auth page classes | `.auth-page` + `.auth-card` defined in app.css (dark theme, percentage widths, CSS vars for padding). Used by `/login` and `/register`. |
| Responsive grid utils | None. No global `.container` with padding, no responsive typography scales, no breakpoint mixins. |
| Consistency issue | app.css auth styles are dark-themed (dashboard colors). `/forgot-password` and `/reset-password` pages redefine auth styles inline with white card + dark gradient background — inconsistent visual treatment. |

---

## Route Audit

| Route | Page Name | Content Description | Has Responsive CSS? | Issues/Notes |
|-------|-----------|-------------------|--------------------|--------------|
| `/` | Landing Page | Full landing: navbar, hero with particles + phone mockup, templates grid, features grid, pricing section (2-col layout), CTA section, footer | **Partial** | Uses `clamp()` for hero title, `auto-fit` grids for templates/features. Mobile hides phone mockup (`display:none` on `.hero-visual`, shown at 900px+). Pricing single-column on mobile → 2-col at 900px. Missing: no breakpoint for <480px small phones (template cards `minmax(320px,1fr)` may overflow on 320px screens). Hero stats row may wrap awkwardly on narrow screens. |
| `/login` | Login | Email + password form, Turnstile CAPTCHA, forgot-password link, register link | **No page-specific** | Relies entirely on app.css `.auth-page`/`.auth-card` classes. Page-specific `<style>` only handles turnstile states + error messages. Layout is fine on most screens due to percentage-width card. No breakpoints for very narrow screens (<360px). |
| `/register` | Register | Username, email, password, confirm password form, Turnstile CAPTCHA | **No page-specific** | Same situation as login. All layout via app.css. No media queries in page style block. Fine for most screens. |
| `/forgot-password` | Forgot Password | Email input form, Turnstile CAPTCHA, back-to-login link | **No** | **Duplicates auth styles inline** (white card on gradient bg) instead of using app.css — inconsistent with login/register dark theme. No media queries in inline `<style>`. `max-width: 420px; width: 100%` is OK for most screens but no small-screen adjustments. |
| `/reset-password/[token]` | Reset Password | New password + confirm password form (no Turnstile) | **No** | **Same duplicated inline auth styles** as forgot-password — white card on gradient bg. No media queries. Missing Turnstile (unlike other auth pages). Same responsive limitations. |
| `/invitation/[slug]` | Invitation View | Full invitation: cover with open button, hero with countdown, quote, couple cards, event details + venue map, love story, gallery grid, gift/bank info, dress code colors, RSVP form + wishes list, audio toggle, scroll-reveal animations | **Yes — multiple breakpoints** | Breakpoints: 480px (countdown items), 600px (gallery `2col→3col`, bank cards grid, event/couple card padding), 768px (couple 2-col with `&` separator, event cards 2-col). Uses `clamp()`, `auto-fit` grids, percentage widths. Cover section `90%` width with `max-width: 400px`. Well-handled responsive overall. Minor: no breakpoint for 1024px+ large screens (content maxes at 800px section width, fine). |
| `/demo/[id]` | Demo Invitation | Same invitation content structure as `[slug]` but with inline wedding sections (no separate component imports). No cover section — goes directly to content. Countdown, couple, events, gallery, gift, dress code, RSVP, wishes. | **Yes — same breakpoints** | Identical responsive CSS to `[slug]` page (same `<style>` block). Same breakpoints (480, 600, 768px). Same responsive quality as invitation page. No cover means less potential mobile layout concern. |

---

## Summary

### Responsive coverage

| Route | Mobile (<480px) | Tablet (480-768px) | Desktop (>768px) |
|-------|----------------|-------------------|-----------------|
| `/` (landing) | Partial | OK | OK |
| `/login` | OK (via app.css) | OK | OK |
| `/register` | OK (via app.css) | OK | OK |
| `/forgot-password` | Minimal | OK | OK |
| `/reset-password/[token]` | Minimal | OK | OK |
| `/invitation/[slug]` | Good | Good | Good |
| `/demo/[id]` | Good | Good | Good |

### Key concerns

1. **Auth page styling inconsistency** — `/forgot-password` and `/reset-password` use white-card-on-gradient (inline styles). `/login` and `/register` use dark dashboard theme (from app.css). Should standardize to one pattern.

2. **Auth form duplication** — 3 auth pages (forgot-password, login, register) each define Turnstile logic identically. Could be extracted to a shared component.

3. **Landing page small-screen gaps** — No `<480px` adjustments. Template cards at `320px` min-width will overflow on 320px-wide phones. Stats row in hero section may wrap poorly.

4. **No global responsive system** — app.css lacks responsive typography scale, responsive spacing scale, or breakpoint utility classes. Each page handles responsiveness ad-hoc.

5. **Reset-password missing Turnstile** — Unlike login, register, and forgot-password, the reset-password page has no Turnstile CAPTCHA. May be intentional (token-based auth), but worth verifying.

### Files with zero page-specific media queries
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password/[token]`
