# Copperline Landing

A modern single-page landing page for **Copperline** (plumbing), built with
**Vite + vanilla HTML/CSS/JS**, animated with **GSAP** (SplitText) and smoothed
with **Lenis**. Opens with a lenis.dev style cinematic intro: half the brand
name appears, the second half pushes in, the curtain lifts, and the wordmark
lands in the nav.

## Run it

```bash
cd copperline-landing
npm install
npm run dev      # local server, usually http://localhost:5173
npm run build    # production files go to dist/
npm run preview  # preview the production build
```

## Where to tweak things

| Want to change | File | What to edit |
|---|---|---|
| Brand name halves | `index.html` | The `.wm-first` / `.wm-second` spans (intro + nav logo must match) |
| Colors, fonts, sizes | `src/styles.css` | The `:root` variables at the top |
| Intro timing + eases | `src/main.js` | The `CONFIG` object (durations in seconds) |
| Scroll feel | `src/main.js` | `CONFIG.lenis.lerp` (lower = floatier) |
| Copy and sections | `index.html` + `src/sections/*.js` | Hero, About stages 1-5, video, gallery, CTA, footer (one `CONTENT` per stage file) |
| Publish URLs | `index.html` | `copperline.example.com` + `og-cover.png` are placeholders; point at the real domain and cover image on launch |
| Hero photo depth | `src/main.js` | `CONFIG.photo` (shift px, glide, zoom, drift); swap the file at `src/assets/hero-bg.webp` |
| About stages + gallery + video | `src/sections/*.js` | One `CONTENT` object at the top of each stage file (`basics.js`, `owner.js` with photo at `src/assets/owner.webp`, `dialog.js`, `tabs.js`, `numbers.js`, `gallery.js` with photos at `src/assets/gallery/`, `video.js` with video at `src/assets/how-we-work.mp4`) |

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
   (SplitText cuts the headline), nav links fade in last.

Scrolling stays locked (`lenis.stop()`) until Phase 4. Visitors with
`prefers-reduced-motion` skip straight to the finished page.

## Slow-motion frame check

Open the dev server with `?slowmo` appended
(`http://localhost:5173/?slowmo`) to run the whole timeline at 0.2x and
watch every frame of the wordmark flight. Remove the param for normal speed.
Resizing after the landing re-parks the wordmark automatically.
