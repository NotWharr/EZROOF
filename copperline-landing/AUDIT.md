# Copperline Landing — Design & Optimization Audit (Step 1)

Date: 2026-10-02. Scope: `copperline-landing/` only (Vite + GSAP + Lenis).
Skills loaded and followed for this audit:
- `design-taste-frontend` (repo skill, read in full): hero discipline, eyebrow
  restraint, color/shape consistency locks, motion rules, image strategy.
- `ui-ux-pro-max-skill` (queried live via `search.py`): Trust & Authority
  landing pattern, Flat-Design low-effect style, pre-delivery checklist
  (contrast 4.5, keyboard, visible focus, reduced motion — all High severity),
  plus the `ux` domain rules on reduced motion and motion sickness.
- Root `AGENTS.md` covers the Next.js app only; not applicable here.

Legend: **HIGH** = fix before ship. **MEDIUM** = fix in this pass.
**LOW** = nice-to-have / accepted tradeoff.

---

## 1. Intro overlay + wordmark

- No flicker found; single element travels, no swap. Verified in-browser.
  OK, no action.
- Phase 2 swipe animates `background-position` (a paint property, not
  transform/opacity). One 0.6s shot, no jank observed. **LOW** (accepted).
- The `#wordmark` link stays keyboard-focusable during the locked intro
  (`pointer-events: none` does not stop Tab). A keyboard user can tab onto
  an invisible giant logo mid-intro. **MEDIUM** (add `tabindex="-1"` until
  landed, restore after).
- `aria-hidden="false"` on `#wordmarkLayer` is noise. **LOW** (remove it).
- `?slowmo` dev hook ships to production. Harmless but undiscoverable;
  keep. No action.

## 2. Nav + progress bar

- Bar verified: flush under nav (`--nav-height` synced to measured 74px),
  `scaleX` only, exactly 1.0 at max scroll, z-order correct. OK.
- Small nav CTA (`btn-small`) is ~38px tall; 44px touch-target minimum
  not met. **MEDIUM** (raise padding to hit 44px).
- No skip-to-content link anywhere on the page. **HIGH** (Step 5 requires it;
  keyboard users tab through the whole nav on every load).
- Anchor click handler calls `document.querySelector(href)` unguarded.
  All current hrefs are valid, but one bad link throws and kills the
  handler for that click. **LOW** (wrap in try/catch).

## 3. Hero

- `hero-bg.webp` is 1.6MB, eager, no `srcset`, no `fetchpriority`, no
  preload. It is the LCP element (~70% of page weight). **HIGH**.
- Inter loads 5 weights (400–800), no preload, `display=swap` with no
  fallback metric guard. Only 400/600/700/800 are used. **MEDIUM**
  (preload 700 + 800, drop unused weights).
- Subcopy, ticks and eyebrow (`--muted` #a1a1aa, lime) sit directly over
  the photo, which has bright copper highlights; the vignette only darkens
  edges. Small-text AA (4.5:1) is at risk over bright spots. **HIGH**
  (add a left-anchored dark scrim behind the copy, then verify).
- Parallax is transform-only, quickTo-smoothed, touch-gated. OK.
- `will-change: transform` sits permanently on `.hero-photo` and its
  `img`, plus `.rail-track`, `.tab-pill`, desktop `.bb-*`, `.dlg`.
  Permanent hints cost memory on mobile. **MEDIUM** (Step 4: keep only
  during active animation).
- Headline `max-width: 16ch` + clamp scale reads well 375–1440. OK.

## 4. About stages 1–4

- Pin math verified in-browser (no stuck pins, no gaps/overlaps). OK.
- Each stage keeps its own scrub/ease constants (0.6–0.8, mixed eases).
  The page does not feel like one animation family yet. **MEDIUM**
  (Step 2: consolidate into CONFIG).
- Stage 3 dialog at scrub-rest is `opacity: 0` but its close button and
  CTA link stay keyboard-focusable: tabbing lands on invisible controls.
  (Tabs does this right with `hidden`; dialog needs the same treatment:
  toggle `visibility`/`inert` with the fade). **HIGH**.
- Dialog section heading is `h3` with no section `h2`; tabs section has
  no heading at all. Heading order should not skip. **MEDIUM** (add
  visually-hidden `h2`s or re-level).
- Owner slot animates `width`/`height` (layout, not transform). Requested
  explicitly and unavoidable for the push-apart effect. **LOW** (accepted).
- Basics facts are plain `div`s (fine, not interactive). Reduced branch
  hides facts and shows details with identical info. OK.
- `?slowmo`-style dev code: none in stages. OK.

## 5. Numbers

- Counters fire once, format with separators, reduced-motion final state
  correct. OK.
- Digits are not `tabular-nums`; Inter is proportional, so values visibly
  jiggle mid-count. **MEDIUM** (one-line CSS fix, already on the Step 3 list).
- `role`/semantics: plain divs + text, acceptable for display stats. OK.

## 6. Video

- `how-we-work.mp4` (855KB) + poster assigned at init: the browser starts
  fetching early even if the user never scrolls there. **MEDIUM** (Step 4:
  set `src`/load lazily near viewport; keep `preload="metadata"`).
- SPACE on a focused control double-toggles: the player `keydown`
  handler fires `togglePlay()` AND the focused button natively clicks
  (also `togglePlay`) — net effect is a no-op press. Arrow keys on the
  scrub slider and volume input double-apply the same way (slider ±5s
  plus player ±5s). **HIGH** (ignore handled keys from native controls;
  let slider/input keep native behavior).
- `.vid-player` itself is not focusable, so shortcuts only work from
  child controls despite the "focused or hovered" comment. **MEDIUM**
  (make the region focusable or scope shortcuts to hover + controls).
- Unused `hovering` flag, leftover `void`-style dead code already removed;
  re-grep in Step 4. **LOW**.
- Bar buttons and close affordance are 36–40px; 44px minimum not met.
  **MEDIUM** (bump to 44px).
- Spinner, toasts, buffered/tooltip/rAF loop, Flip open/close, focus
  trap + return, error fallback: all verified working in-browser. OK.
- No captions track (placeholder content; flag for real footage).
  **MEDIUM** (note for production; out of scope for placeholders).
- Reduced motion respected (no autoplay/pin/Flip). OK.

## 7. Gallery

- Lens math, snap-to-center, bounds, keyboard arrows, prev/next,
  progress line all verified in-browser. OK.
- `gsap.ticker.add(updateLens)` runs 24 `getBoundingClientRect` calls
  every frame forever, even when the rail is off-screen. **MEDIUM**
  (gate with IntersectionObserver; disconnect off-screen).
- `figure[tabindex]` carries `aria-label` AND inner `img[alt]`: screen
  readers can announce the caption twice. **LOW** (empty `alt` since the
  figure is named).
- Drag pill is `position: fixed` with no `top/left`: if ever shown
  without cursor coords it parks at its static spot. Only shown on
  mousemove, so unreachable in practice. **LOW**.
- Touch: `pan-y` + Draggable verified pattern; drag works, page scroll
  preserved. OK.

## 8. CTA band + curtain footer

- Curtain verified at 1440/768/375: reveal order correct, progress hits
  exactly 1.0, no bottom gap, no horizontal overflow (fixed: glow
  rotation bbox, grid minimums, gap minimums). OK.
- Entrance trigger uses `top 92%` (exact-bottom equality proved
  unreachable by fractional pin math — documented in code). OK.
- `[MY NAME]` placeholder still in footer copy. **MEDIUM** (needs the
  real name before ship; not auto-fixable).
- Social links point at bare platform domains (placeholder). **LOW**.
- Footer headings are `h3` following page `h2`s. Order OK.
- Reduced motion: static, no pin. OK.

## 9. Cross-cutting: performance

- Bundle (dist): JS ~241KB (GSAP all-plugins), CSS ~22KB, images ~2.5MB
  (hero 1.6MB dominates), video 855KB. **HIGH** for hero weight (see §3).
- Fonts: 5 Inter weights, no preload (see §3). **MEDIUM**.
- `will-change` permanently on 6+ layers (see §3). **MEDIUM**.
- Dead code: `.quote`/`.narrow` CSS (reviews section deleted),
  `hovering` flag (video.js), `?slowmo` fine to keep. **LOW** (sweep).
- `ScrollTrigger.refresh()` after fonts+images exists; per-module
  refreshes are debounced. OK. Resize handlers: three independent
  debounce-less listeners (`syncNavHeight` raw, wordmark 200ms,
  gallery/tabs 200ms). **LOW** (consolidate or debounce nav sync).
- No `console.log` found in stage files (verify with grep in Step 2).
- Lighthouse cannot run in this environment (no Chrome); scores must
  be measured manually — see test checklist. Targets: Perf 90+,
  A11y/SEO/Best-Practices 95+, CLS < 0.05, LCP < 2.5s.

## 10. Cross-cutting: accessibility

- Landmarks: `header`/`nav`/`main`/`footer` present; one `h1`. **HIGH**
  items: missing skip link (§2), invisible-focusable dialog (§4),
  shortcut double-fire (§6).
- Focus rings: global lime rule + per-component rings. OK.
- `prefers-reduced-motion`: full coverage per branch, verified logic.
  One gap: scrub smoothing values and the global CSS kill-switch are
  consistent. OK.
- Touch targets <44px: nav CTA, video bar buttons/close, social buttons
  (40px). **MEDIUM** (bump all to 44px).
- Alt text: gallery/owner/hero handled; hero-bg is `alt=""` decorative
  over real copy — acceptable with the scrim fix. Contact/footer icons
  decorative. OK.

## 11. Cross-cutting: responsive

- Verified 375/768/1440 + pins collapse <768. Untested: 360, 390, 1024,
  1920, landscape phone. **MEDIUM** (verify in Step 6).
- Type scale is clamp-based throughout; headline fits. OK.
- 1920px: `--wrap` caps at 72rem; hero photo 1.6MB will look soft
  full-bleed. **LOW** (srcset in Step 4 covers it).

## 12. SEO / meta

- Present: title, description, `lang`. Missing: Open Graph + Twitter
  tags, `theme-color`, favicon, canonical. **HIGH** (Step 7 list; cheap).
- Footer already carries the concept-site line. OK.

## 13. "Original website" (Next.js ezroof app) — NOT audited yet

- Step 2–7 improvements should be ported where they apply (locks,
  contrast, focus, reduced motion). Requires its own pass; flagged now
  so it is not forgotten. No action in Step 1.

## Ranked fix list (Step 2 order)

HIGH: hero 1.6MB weight; text-over-photo scrim; skip link; invisible-focusable dialog; shortcut double-fire; SEO meta set.
MEDIUM: Inter weights/preload; will-change sweep; shared CONFIG eases; tabular-nums; video lazy-src; captions note; ticker gating; 44px targets; heading levels; [MY NAME]; widths 360/390/1024/1920 + landscape; anchor-handler guard.
LOW: background-position swipe; owner slot layout anim; gallery double-announce; drag-pill static spot; console/dead-code sweep; resize-listener consolidation; 1920 softness; social hrefs.
