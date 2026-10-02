# Copperline

A single-page landing site for **Copperline** (plumbing), rebuilt with
**Vite 8 + React 19 + TypeScript + Tailwind CSS v4**. Animation with
**GSAP + ScrollTrigger** (pinned chapters, curtain intro, FLIP fullscreen),
**Lenis** smooth scroll synced via the GSAP ticker, and **Motion** for
reveals, masked headlines, the FAQ accordion, magnetic buttons and
count-ups. Opens with a cinematic intro: half the brand name appears,
the second half pushes in, the curtain lifts, and the wordmark lands
in the nav.

## Run it

```bash
npm install
npm run dev      # local server, usually http://localhost:5173
npm run build    # strict typecheck (tsc) + production files to dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Where to tweak things

| Want to change | File | What to edit |
|---|---|---|
| All copy | `src/content.ts` | One object per section; components only do layout + motion |
| Colors, fonts, sizes | `src/index.css` | The `@theme` tokens at the top |
| Shared eases/durations | `src/lib/motion.ts` | `MOTION` object used by every section |
| Brand name halves | `src/components/Preloader.tsx` | Renders from `BRAND` in `content.ts` |
| Scroll feel | `src/App.tsx` | Lenis `lerp` (lower = floatier) |
| Hero photo depth | `src/components/Hero.tsx` | Parallax shift, glide, zoom constants |
| Publish URLs | `index.html` | `copperline.example.com` + `og-cover.png` are placeholders; point at the real domain and cover image on launch |
| Gallery/owner photos | `src/components/Gallery.tsx`, `src/components/Owner.tsx` | Seeded `picsum.photos` URLs; swap seeds or files |
| Video + poster | `src/assets/how-we-work.mp4`, `src/assets/how-we-work-poster.webp` | Imported by `src/components/Video.tsx` |

## How the intro works (short version)

1. **Phase 1** `Copper` fades up inside a full-screen overlay. `line` sits
   clipped to zero width, so it takes up no space.
2. **Phase 2** The clip opens with `power4.inOut`. Because the wordmark row is
   centered flex, the growing `line` half physically pushes `Copper` left.
3. **Phase 3** The code measures the wordmark and the invisible nav slot
   with `getBoundingClientRect()` at curtain time, then moves the *same*
   element (transform only: x, y, scale) onto the slot while the overlay
   slides up on the same label, duration and ease. No duplicate, no swap.
4. **Phase 4** Scrolling unlocks, hero lines rise out of overflow-hidden masks
   (Motion staggered line reveals), nav links fade in last.

Scrolling stays locked (`lenis.stop()`) until Phase 4. Visitors with
`prefers-reduced-motion` skip straight to the finished page.

## Slow-motion frame check

Open the dev server with `?slowmo` appended
(`http://localhost:5173/?slowmo`) to run the whole timeline at 0.2x and
watch every frame of the wordmark flight. Remove the param for normal speed.
Resizing after the landing re-parks the wordmark automatically.
