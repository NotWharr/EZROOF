/* ============================================================
   COPPERLINE LANDING - animation + smooth scroll
   Stack: GSAP (timeline + ScrollTrigger + SplitText) + Lenis.

   HOW TO TWEAK: almost everything lives in CONFIG below.
   Durations are seconds. Eases are GSAP names, try "power2.out",
   "power4.inOut" or "expo.inOut" to feel the difference.

   SINGLE-ELEMENT WORDMARK: #wordmark is the only visible brand
   element. It starts huge at screen center in its own fixed layer
   (above the overlay), then transform-only travel (x, y, scale)
   parks it exactly on the invisible .nav-logo-slot. Nothing is
   ever hidden, shown or swapped at the end.

   SLOW-MOTION CHECK: open the page with ?slowmo in the URL
   (http://localhost:5173/?slowmo) to watch the whole timeline
   at 0.2x. Remove the param for normal speed.
   ============================================================ */

import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { initBasics } from "./sections/basics.js"; // Stage 1: pinned About intro
import { initOwner } from "./sections/owner.js"; // Stage 2: owner headline + photo
import { initDialog } from "./sections/dialog.js"; // Stage 3: feature dialog + modal
import { initTabs } from "./sections/tabs.js"; // Stage 4: credentials/values tabs
import { initNumbers } from "./sections/numbers.js"; // Stage 5: count-up stats
import { initGallery } from "./sections/gallery.js"; // Lens rail work gallery
import { initVideo } from "./sections/video.js"; // How-we-work player + Flip fullscreen
import { initFooter } from "./sections/footer.js"; // Curtain-reveal site footer

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Dev tool for the slow-motion frame check. */
if (new URLSearchParams(window.location.search).has("slowmo")) {
  gsap.globalTimeline.timeScale(0.2);
}

/* ---------- 1. One config object for all timing ---------- */
const CONFIG = {
  intro: {
    firstIn: 0.8,    // Phase 1: "Copper" fades/slides in
    firstHold: 0.5,  // Phase 1: beat before "line" enters
    secondIn: 1.0,   // Phase 2: "line" pushes in from the mask
    fullHold: 0.4,   // Phase 2: beat with the full word centered
    curtain: 1.2,    // Phase 3: overlay lifts + wordmark travels
  },
  eases: {
    soft: "power3.out",    // entrances
    push: "power4.inOut",  // Phase 2, the physical shove
    curtain: "expo.inOut", // Phase 3, overlay + wordmark in sync
    rise: "power3.out",    // Phase 4, hero elements floating up
  },
  hero: {
    y: 40,          // how far hero pieces travel (px)
    duration: 0.9,  // each hero piece
    stagger: 0.08,  // gap between masked lines/words
  },
  swipe: {
    duration: 0.6,      // green wipe across "line", before the push
    ease: "power3.inOut",
  },
  progress: {
    fadeIn: 0.6, // bar appears with the nav links in Phase 4
  },
  lenis: {
    lerp: 0.1, // lower = smoother/heavier, higher = snappier
  },
  photo: {
    shift: 20,     // max mouse parallax travel (px each way)
    glide: 0.7,    // quickTo smoothing (seconds), higher = floatier
    zoom: 1.1,      // scroll zoom starts here, settles to 1.0
    drift: 10,      // scroll drift (percent), lags behind the content
  },
};

/* ---------- 2. Grab the elements we animate ---------- */
const intro = document.getElementById("intro");
const wordmark = document.getElementById("wordmark");
const navSlot = document.querySelector(".nav-logo-slot");
const heroTitle = document.querySelector(".hero-title");
const heroPhoto = document.querySelector(".hero-photo");
const heroPhotoImg = document.querySelector(".hero-photo img");
const nav = document.getElementById("nav");
const progressBar = document.querySelector(".scroll-progress");
const progressFill = document.querySelector(".scroll-progress-fill");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches; // touch devices
let landed = false; // true once the wordmark is parked in the nav

// Mobile-first: small screens and touch devices get a shortened intro
// so content is interactive in ~2s instead of ~6s on a slow phone.
const isMobileIntro =
  window.matchMedia("(max-width: 767px)").matches || coarsePointer;
if (isMobileIntro) {
  CONFIG.intro.firstIn = 0.35;
  CONFIG.intro.firstHold = 0.1;
  CONFIG.intro.secondIn = 0.45;
  CONFIG.intro.fullHold = 0.1;
  CONFIG.intro.curtain = 0.7;
  CONFIG.hero.duration = 0.5;
  CONFIG.hero.stagger = 0.04;
  CONFIG.swipe.duration = 0.3;
  CONFIG.progress.fadeIn = 0.3;
}

// Intro lifecycle: exactly-once unlock. The fail-safe (registered right
// after the scroll lock, before any section init runs) guarantees the
// loading overlay can never strand the visitor, even if a section
// module throws on some particular device.
let introDone = false;
let introTL = null;
let revealsArmed = false;

function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.warn(`[init] ${name} skipped:`, err);
  }
}

function armReveals() {
  if (revealsArmed) return;
  revealsArmed = true;
  initScrollReveals();
}

// Last-resort landing: kill the timeline, park everything in its final
// state, unlock scroll. Idempotent: safe to call twice or after success.
function finishIntro() {
  if (introDone) return;
  introDone = true;
  if (introTL) {
    introTL.kill();
    introTL = null;
  }
  try {
    gsap.set("#wordmark .wm-first", { opacity: 1, y: 0 });
    gsap.set(".wm-mask", { clipPath: "inset(0 0 0 0%)" });
    gsap.set("#wordmark .wm-second", { x: 0, backgroundPosition: "0% 0" });
    gsap.set(".hero-title, .hero-title *", { yPercent: 0, y: 0, opacity: 1 });
    gsap.set(".eyebrow .mask-inner, .hero-sub .mask-inner, .hero-cta .mask-inner", {
      yPercent: 0,
    });
    gsap.set(".hero-visual", { opacity: 1, scale: 1 });
    gsap.set(".hero-ticks li", { opacity: 1, y: 0 });
    gsap.set(".nav-links, .nav-right, .scroll-progress", { opacity: 1, y: 0 });
    if (!landed) landWordmark();
    intro.style.display = "none";
    armReveals();
  } finally {
    try {
      lenis.start();
    } catch (_) {
      document.documentElement.classList.remove("lenis-stopped");
    }
  }
}

// The traveling wordmark must not take keyboard focus mid-flight:
// pointer-events ignore Tab, so park it out of the tab order until it lands.
wordmark.setAttribute("tabindex", "-1");

/* ---------- 3. Lenis smooth scroll, wired into GSAP ---------- */
// Lenis replaces the browser's jumpy scroll. GSAP's ticker drives it
// so scroll animations stay perfectly in sync.
const lenis = new Lenis({ lerp: CONFIG.lenis.lerp });
lenis.on("scroll", ScrollTrigger.update); // tell ScrollTrigger on every scroll
gsap.ticker.add((time) => lenis.raf(time * 1000)); // Lenis rides the GSAP clock
gsap.ticker.lagSmoothing(0); // no catch-up jumps after tab switches

// Lock scroll during the intro, unlock when the hero reveals.
lenis.stop();
document.documentElement.classList.add("js-anim"); // allow overlay + layer to show
history.scrollRestoration = "manual"; // browser must not restore old scroll pos
window.scrollTo(0, 0);

// Schedule the intro BEFORE any section init runs, so a throwing
// section can never cancel the unlock. The fonts wait is shorter on
// mobile: a fallback-font first paint beats a loading screen.
if (reduceMotion) {
  gsap.set("#wordmarkLayer", { opacity: 0 });
  intro.style.display = "none";
  document.fonts.ready.then(() => {
    gsap.set("#wordmark .wm-first", { opacity: 1, y: 0 });
    gsap.set(".wm-mask", { clipPath: "inset(0 0 0 0%)" });
    gsap.set("#wordmark .wm-second", { x: 0, backgroundPosition: "0% 0" });
    landWordmark();
    gsap.set("#wordmarkLayer", { opacity: 1 });
    gsap.set(progressBar, { opacity: 1 });
    lenis.start();
    introDone = true;
    armReveals();
  });
} else {
  const fontTimeout = isMobileIntro ? 800 : 1500;
  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, fontTimeout)),
  ]).then(() => {
    try {
      runIntro();
    } catch (err) {
      console.warn("[intro] failed, landing directly:", err);
      finishIntro();
    }
  });
}

// Absolute fail-safe: the overlay can never outlive this timer.
setTimeout(() => {
  if (!introDone) finishIntro();
}, isMobileIntro ? 4500 : 7000);

/* Anchor links: glide with Lenis instead of jumping. The wordmark
   is a link too, but its layer ignores clicks until it lands. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    let target = null;
    try {
      target = document.querySelector(link.getAttribute("href"));
    } catch (_) {
      target = null; // malformed href: let the browser handle it
    }
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target);
  });
});

// Photo depth runs on its own, independent of the intro timeline.
// It no-ops itself for reduced motion and touch pointers.
initPhotoDepth();

// Keep --nav-height exactly flush: measure the real nav box on
// load, font swap, and resize (covers every breakpoint for free).
function syncNavHeight() {
  document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
}
syncNavHeight();
let navSyncTimer; // resize fires per pixel: settle first, measure once
window.addEventListener("resize", () => {
  clearTimeout(navSyncTimer);
  navSyncTimer = setTimeout(syncNavHeight, 150);
});
document.fonts.ready.then(syncNavHeight);

// Stages plug in here, one call each. Each is guarded: a throwing
// section can log and skip instead of stranding the intro (the
// trigger + fail-safe above are already scheduled). Stage modals
// reach Lenis through window.__lenis to lock/unlock background scroll.
window.__lenis = lenis;

// Scroll progress: transform-only fill driven by total page scroll.
// Pin spacers count as page height, so this lands on exactly 100%
// at the true bottom with no backward jumps. No extra listeners:
// Lenis already pumps ScrollTrigger through the gsap ticker.
gsap.set(progressBar, { opacity: 0 }); // hidden while scroll is locked
gsap.to(progressFill, {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    scrub: reduceMotion ? true : 0.3, // reduced: follow exactly, no smoothing
  },
});
safeInit("basics", initBasics);
safeInit("owner", initOwner);
safeInit("dialog", initDialog);
safeInit("tabs", initTabs);
safeInit("numbers", initNumbers);
safeInit("gallery", initGallery);
safeInit("video", initVideo);
safeInit("footer", initFooter);

// Pinned scroll distances depend on real layout, which shifts as
// fonts and images arrive. Re-measure everything once settled.
function imagesReady() {
  return Promise.all(
    Array.from(document.images).map((img) =>
      img.complete
        ? null
        : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          })
    )
  );
}
Promise.all([document.fonts.ready, imagesReady()]).then(() => {
  ScrollTrigger.refresh();
});

/* ---------- 4. FLIP measure: wordmark rect vs nav slot rect ---------- */
// Reads both boxes fresh, so call it at the moment of travel, never
// earlier. Scale comes from the width ratio, translate from the
// center delta. With transformOrigin center, centers stay glued.
function measureFlip() {
  const from = wordmark.getBoundingClientRect();
  const to = navSlot.getBoundingClientRect();
  return {
    dx: to.left + to.width / 2 - (from.left + from.width / 2),
    dy: to.top + to.height / 2 - (from.top + from.height / 2),
    scale: to.width / from.width,
  };
}

/* Park the wordmark on the slot. Instant when asked (reduced motion,
   resize recovery), so there is never a frame where it sits wrong. */
function landWordmark() {
  const flip = measureFlip();
  gsap.set(wordmark, {
    x: flip.dx,
    y: flip.dy,
    scale: flip.scale,
    transformOrigin: "center",
  });
  landed = true;
  wordmark.classList.add("landed"); // clicks on, visuals untouched
  wordmark.classList.add("is-solid"); // wipe done: lock solid lime
  wordmark.removeAttribute("tabindex"); // keyboard can reach the logo now
  document.getElementById("wordmarkLayer").removeAttribute("aria-hidden");
}

/* Window resized after landing? Clear the old transform, measure the
   new layout and re-park, all inside one handler so the browser
   paints once. Nothing flashes. Debounced to fire after resizing. */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!landed) return; // mid-intro: travel measures fresh anyway
    gsap.set(wordmark, { clearProps: "transform" });
    landWordmark();
  }, 200);
});

/* Intro trigger + reduced-motion branch live near the top (Section 3),
   scheduled before the section inits, with a fail-safe timeout. */

/* ---------- 6. The master intro timeline (Phases 1-4) ---------- */
function runIntro() {
  if (introDone) return; // fail-safe already landed: never replay
  // Cut the headline into masked lines for the Phase 4 rise.
  // `mask: "lines"` wraps each line in an overflow-hidden div,
  // so text slides up from inside it. Guarded in case the
  // plugin ever fails to load: plain text is the fallback.
  let titleLines = [];
  if (typeof SplitText !== "undefined") {
    const split = new SplitText(heroTitle, { type: "lines", mask: "lines" });
    titleLines = split.lines;
  }

  // Starting states (set in JS so no-JS visitors still see content).
  gsap.set("#wordmark .wm-first", { opacity: 0, y: 40 });
  gsap.set(wordmark, { transformOrigin: "center" });
  gsap.set(".nav-links, .nav-right", { opacity: 0, y: -8 });
  gsap.set(".hero-ticks li", { opacity: 0, y: CONFIG.hero.y });

  const tl = gsap.timeline({ defaults: { ease: CONFIG.eases.soft } });
  introTL = tl; // fail-safe can kill it from here on

  /* Phase 1: first half only. */
  tl.to("#wordmark .wm-first", { opacity: 1, y: 0, duration: CONFIG.intro.firstIn })
    .to({}, { duration: CONFIG.intro.firstHold }); // empty tween = a beat

  /* Phase 2: swipe to green, THEN push in from the mask.
     The swipe runs while the span is still clipped, so the green
     is fully applied before the reveal starts. No white flash.
     The wordmark row is centered, so as "line" takes up space the
     browser shoves "Copper" left for us. Real push, free centering. */
  tl.to("#wordmark .wm-second", {
    backgroundPosition: "0% 0", // gradient wipe, never a color fade
    duration: CONFIG.swipe.duration,
    ease: CONFIG.swipe.ease,
  })
  .to(".wm-mask", {
    clipPath: "inset(0 0 0 0%)",
    duration: CONFIG.intro.secondIn,
    ease: CONFIG.eases.push,
  }, "-=0.1") // push starts inside the swipe's last beat
    .fromTo("#wordmark .wm-second", { x: 90 }, { x: 0, duration: CONFIG.intro.secondIn, ease: CONFIG.eases.push }, "<")
    .to({}, { duration: CONFIG.intro.fullHold });

  /* Phase 3: curtain + travel, SAME label, SAME duration, SAME ease.
     Both tweens start on the identical tick, so they cannot drift.
     Endpoints are functions: GSAP evaluates them when the tween
     starts, i.e. from the final layout, never from stale numbers.
     Only transform moves. Font, weight, spacing and color never
     change, so scaling is the sole visible difference. */
  tl.add("curtain");
  tl.to(
    wordmark,
    {
      x: () => measureFlip().dx,
      y: () => measureFlip().dy,
      scale: () => measureFlip().scale,
      duration: CONFIG.intro.curtain,
      ease: CONFIG.eases.curtain,
      onComplete: () => {
        landed = true;
        wordmark.classList.add("landed"); // clicks on, visuals untouched
        wordmark.classList.add("is-solid"); // wipe done: lock solid lime
        wordmark.removeAttribute("tabindex");
        document.getElementById("wordmarkLayer").removeAttribute("aria-hidden");
      },
    },
    "curtain"
  );
  tl.to(
    intro,
    {
      yPercent: -100,
      duration: CONFIG.intro.curtain,
      ease: CONFIG.eases.curtain,
      onComplete: () => {
        intro.style.display = "none"; // fully off-screen, nothing to swap
      },
    },
    "curtain"
  );

  /* Phase 4: hero floats up, in order. */
  tl.add(() => lenis.start(), isMobileIntro ? "curtain+=0.25" : "curtain+=0.65"); // scroll frees as the curtain lifts
  tl.to(".nav-links, .nav-right, .scroll-progress", { opacity: 1, y: 0, duration: CONFIG.progress.fadeIn }, ">");
  tl.fromTo(
    ".eyebrow .mask-inner",
    { yPercent: 110 },
    { yPercent: 0, duration: CONFIG.hero.duration, ease: CONFIG.eases.rise }
  );
  if (titleLines.length) {
    tl.fromTo(
      titleLines,
      { yPercent: 110 },
      { yPercent: 0, duration: CONFIG.hero.duration, ease: CONFIG.eases.rise, stagger: CONFIG.hero.stagger },
      "-=0.65"
    );
  }
  tl.fromTo(
    ".hero-sub .mask-inner",
    { yPercent: 110 },
    { yPercent: 0, duration: CONFIG.hero.duration, ease: CONFIG.eases.rise },
    "-=0.65"
  );
  tl.fromTo(
    ".hero-cta .mask-inner",
    { yPercent: 110 },
    { yPercent: 0, duration: CONFIG.hero.duration, ease: CONFIG.eases.rise },
    "-=0.65"
  );
  tl.fromTo(
    ".hero-visual",
    { opacity: 0, scale: 1.06 },
    { opacity: 1, scale: 1, duration: 1.2, ease: CONFIG.eases.rise },
    "-=0.9"
  );
  tl.to(".hero-ticks li", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: CONFIG.eases.rise,
    stagger: CONFIG.hero.stagger,
  }, "-=0.9");

  tl.add(() => {
    armReveals(); // arm the scroll sections once the hero lands (exactly once)
    introDone = true;
    introTL = null;
  });
}

/* ---------- 7. Hero photo depth (independent of the intro) ---------- */
// Two nested layers so the two motions never fight:
//   wrapper (.hero-photo)  <- mouse parallax (x/y)
//   img itself             <- scroll zoom + drift (scale/yPercent)
// Transform-only, eased, and fully skipped for reduced motion
// or touch pointers (no cursor to follow there).
function initPhotoDepth() {
  if (reduceMotion || coarsePointer || !heroPhoto) return;

  // Mouse parallax: quickTo gives one eased tween per axis that we
  // retarget on every mousemove. Cheap, no timeline spam.
  const xTo = gsap.quickTo(heroPhoto, "x", { duration: CONFIG.photo.glide, ease: "power3" });
  const yTo = gsap.quickTo(heroPhoto, "y", { duration: CONFIG.photo.glide, ease: "power3" });

  window.addEventListener("mousemove", (event) => {
    // -0.5..0.5 across the viewport, flipped so the photo drifts
    // opposite the cursor (background recedes = depth).
    gsap.set(heroPhoto, { willChange: "transform" }); // hint only while driven
    clearTimeout(heroPhoto._idle);
    heroPhoto._idle = setTimeout(() => gsap.set(heroPhoto, { willChange: "auto" }), 1500);
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    xTo(-nx * CONFIG.photo.shift);
    yTo(-ny * CONFIG.photo.shift);
  });

  // Scroll: slow zoom out + gentle lag behind the scrolling content.
  gsap.fromTo(
    heroPhotoImg,
    { scale: CONFIG.photo.zoom, yPercent: 0 },
    {
      scale: 1,
      yPercent: CONFIG.photo.drift,
      ease: "none", // scrub owns the pacing, easing would fight it
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onToggle: (self) =>
          gsap.set(heroPhotoImg, { willChange: self.isActive ? "transform" : "auto" }),
      },
    }
  );
}

/* ---------- 8. Scroll-triggered reveals (gives Lenis room to shine) ---------- */
function initScrollReveals() {
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { y: CONFIG.hero.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: CONFIG.hero.duration,
        ease: CONFIG.eases.rise,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
  });
}
