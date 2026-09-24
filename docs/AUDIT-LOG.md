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
| M4 | Tiggo 4 hero copy sat over the car grille at 1280–1440; on phones the copy covered the car on every model | P1 | Studio `t4-34` has the car centred; on phones the copy was overlaid on a full-height image | Asset **`hero-t4-terelj-v2`** (existing; car right of centre, left third clear) + `hero-t4-terelj-v2-tall`; desktop `object-position: 70% 55%`. **Mobile uses a stacked layout** (image in a 4:3 frame, copy below on a dark ground) so text cannot overlap the car. Key-spec row sizes to the verified specs (3 for Tiggo 4 → 3 columns, no empty slot) | Visually verified before/after at 1440/1280/768/430/390/360: copy/image overlap −24px (none); image 270–329px tall on phones; CTAs above the fold at 360×780–430×932 (not at 360×640); no horizontal scroll; CLS 0 | ✅ |
| M6 | Header overflowed by 8–18px at 1000–1280 after the new menu items | P1 | Five groups + phone + CTA wider than the container | Phone from 1440px; tighter menu at 1000–1259; slimmer CTA at 1000–1099 | 10 routes × 9 widths: no horizontal overflow | ✅ |
| M7 | At 360px «Хүчин чадал, м.х» wrapped to two lines, so its value sat lower than its neighbours | P2 | Unit in the label; label above value | Unit moved into the value (`109 / 154 м.х`), label «Хүчин чадал»; value shown above its label (`dd { order: -1 }`), same convention on all models | 360/390/430/768: all three values on one line, labels 20px, font 12px unchanged | ✅ |
| M5 | Sections repeated the model name as a heading («Tiggo 4-ийн шийдлүүд», gallery H2 «Tiggo 4») | P2 | Template used `m.name` as section titles | «Гол шийдлүүд» (story: safety, tech, drivetrain) and «Гадна ба дотоод орчин» (gallery: exterior + interior shots) — headings describe existing content | 4 model pages: one H1, no H2 equal to the model name, no level skips | ✅ |

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
| N2 | Burger label stayed «Цэс нээх» when open | P2 | Static `aria-label` on `<summary>` | `toggle` handler sets «Цэс хаах»/«Цэс нээх» and `aria-expanded`; `aria-controls="burger-panel"`; Esc closes and returns focus to the button | Keyboard: Enter opens, Tab enters the panel, Esc closes with focus back on the button (outline visible) | ✅ |
| N3 | Menu opened with no backdrop; page stayed scrollable | P2 | Design | `rgba(8,8,10,.5)` backdrop (no blur), tap closes; `html.menu-open { overflow: hidden }`; opacity transition off under reduced motion | Backdrop opacity 1 when open, 0 when closed; tap closes and unlocks scroll; no scroll jump (600 → 600) | ✅ |

## Final P2 sweep

Home, 4 model pages, contact, service × 1440/1280/1024/768/430/390/360 (49 combinations) + mobile menu:
all 200, load at `scrollY 0`, no horizontal overflow, one H1, no heading skips, no text under 12px, menu never clipped, no console errors.
Button heights normalised: 44px desktop, 48px touch (hero-header text CTA 40 → 44, mobile model hero 46 → 48).
