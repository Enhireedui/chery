# Audit log — CHERY Mongolia / Sain Motors

Severity: **P0** high impact · **P1** important polish · **P2** enhancement.
Status: ✅ fixed & verified · 🟡 open · ⏸ deferred (lower priority).

## Home

| # | Issue | Sev | Cause | Fix | Verification | Status |
|---|---|---|---|---|---|---|
| H1 | Home page jumps past the hero to the model showcase on load (scrollY 878) | P0 | `ModelSelector` centred the active pill with `scrollIntoView({ block: "nearest" })`, which scrolls the page when the rail is off-screen | Container-level horizontal scroll only: `rail.scrollTo({ left })` computed from the item/rail rects, clamped at 0 | Playwright, 1440 / 390 / 360: load `scrollY = 0`, hero top = 0; picks, arrows, swipe, resize keep page Y fixed and the active pill visible; back/forward and `/#models` anchor correct (19/19 pass) | ✅ |

## Model detail page

| # | Issue | Sev | Cause | Fix | Verification | Status |
|---|---|---|---|---|---|---|
| M1 | First screen lacked key specs and a clear next step; price styled inline | P1 | Hero held name + price + generic buttons only | Tagline, price block, verified key specs from `specs` (none for Tiggo 7), «Тест драйв захиалах» + «Үнийн санал авах» | 1280 / 1440 / 1920 and 390 screenshots | ✅ |
| M2 | Test-drive CTA did not carry the model into the form | P1 | Plain `/contact#захиалга` link | `leadHref(purpose, model)`; form reads `?model=` / `?purpose=` | `/contact?model=tiggo-4&purpose=quote` → select = tiggo-4, purpose = quote | ✅ |
| M3 | No persistent action on long mobile pages | P1 | — | Mobile action bar after the hero, hidden at the footer | 390 screenshot, bar shows mid-page | ✅ |
| M4 | Tiggo 4 hero copy sits over the car grille at 1280–1440 | P1 | Source image has the car centred | Needs a right-weighted hero image (asset work) | Screenshot | 🟡 |
| M5 | Section heading repeats the bare model name (H2 «Tiggo 8») | P2 | Template | — | Heading outline | ⏸ |

## Contact / test-drive

| # | Issue | Sev | Cause | Fix | Verification | Status |
|---|---|---|---|---|---|---|
| C1 | On phones, `#захиалга` links land on the showroom block; the form is below the fold | P1 | Anchor was on the section, whose first column (showroom) stacks first on mobile | Anchor moved onto the form itself; section is now `#шоурум` | 390: form visible at anchor | ✅ |
| C2 | «Худалдан авалт» and «Холбоо барих» both marked active on /contact | P1 | Parent active state matched child paths that point at /contact | Menu items that link to a form (href with a query) never take the active state | Screenshot | ✅ |
| C3 | No inline validation, phone format or loading state | P1 | Native bubbles only | Inline field errors, `9911 2233` formatting, loading state, success copy | Empty submit shows both field errors | ✅ |
| C4 | Form title was H3 under the address H2 | P2 | Template | Now H2 (visual size unchanged) | Heading outline | ✅ |

## Footer

| # | Issue | Sev | Cause | Fix | Verification | Status |
|---|---|---|---|---|---|---|
| F1 | Footer organised by internal content; no model links | P1 | Single «Хэрэгсэл» column | Models · Худалдан авалт · Эзэмшигчдэд · Sain Motors/Chery, then showroom/hours, then legal | Desktop + 390 screenshots | ✅ |
| F2 | Footer links 40px tall on touch | P1 | `min-height: 40px` | 44px | Measured | ✅ |

## Mobile navigation

| # | Issue | Sev | Cause | Fix | Verification | Status |
|---|---|---|---|---|---|---|
| N1 | New sub-menus had no mobile pattern | P1 | — | `<details>` accordions, 48px rows | 390: open/close, Esc and outside tap close | ✅ |
| N2 | Burger button label stays «Цэс нээх» when open | P2 | Static `aria-label` on `<summary>` | — | — | ⏸ |
| N3 | Menu panel opens without a backdrop | P2 | Design | — | — | ⏸ |
