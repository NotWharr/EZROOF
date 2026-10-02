/* ============================================================
   STAGE 3 - FEATURE DIALOG (pinned modal moment + real modal)
   Scrubbed: tile rests, overlay dims + blurs, dialog rises with
   a lime light-trail, content staggers in, all fades out.
   Click the tile any time and the same dialog opens as a true
   modal: role="dialog", focus trap, Escape, focus returned.

   Desktop (>=768px): pinned section, scrubbed timeline.
   Mobile (<768px):   no pin, tile + panel stacked, fade-ups.
   Reduced motion:    static page, modal opens/closes instantly.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  tileTitle: "Our promise",
  tileHint: "Tap to read it",
  dialogTitle: "Fixed right, or free",
  bullets: [
    "Flat price approved before we start",
    "Shoe covers on, water tested at every fixture",
    "5-year labor warranty in writing",
  ],
  buttonLabel: "Get free estimate",
  buttonHref: "#contact",
  closeLabel: "Close dialog",
};

/* Scrub feel, shared family (see motion.js). Modal snap eases stay
   local: they are real-time beats, not scroll beats. */
/* Extra scroll distance the pin holds, in viewport multiples. */
const PIN_DISTANCE = "+=250%";

export function initDialog() {
  const root = document.getElementById("about-dialog");
  if (!root) return;

  // Render everything from CONTENT so copy edits stay in one place.
  const tile = root.querySelector(".dlg-tile");
  tile.querySelector(".dlg-tile-title").textContent = CONTENT.tileTitle;
  tile.querySelector(".dlg-tile-hint").textContent = CONTENT.tileHint;

  const dialog = root.querySelector(".dlg");
  const dialogTitle = root.querySelector(".dlg-dialog-title");
  dialogTitle.textContent = CONTENT.dialogTitle;
  const list = root.querySelector(".dlg-list");
  list.innerHTML = "";
  CONTENT.bullets.forEach((text) => {
    const li = document.createElement("li");
    li.className = "dlg-piece"; // staggered as its own beat
    li.textContent = text;
    list.appendChild(li);
  });
  const cta = root.querySelector(".dlg-cta");
  cta.textContent = CONTENT.buttonLabel;
  cta.href = CONTENT.buttonHref;
  const closeBtn = root.querySelector(".dlg-close");
  closeBtn.setAttribute("aria-label", CONTENT.closeLabel);

  const overlay = root.querySelector(".dlg-overlay");
  const trail = root.querySelector(".dlg-trail");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isStacked = () =>
    window.matchMedia("(max-width: 767px)").matches || reduceMotion;

  /* ---------- Shared modal controls (a11y core) ---------- */
  let lastFocused = null;

  // All focusable controls inside the dialog, in tab order.
  const focusables = () =>
    Array.from(
      dialog.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled && el.offsetParent !== null);

  // Keep Tab cycling inside the open dialog; Escape closes it.
  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // The unscrubbed open: same beats as the scroll version,
  // played as real time. Instant when reduced motion is on.
  function openDialog() {
    lastFocused = document.activeElement;
    dialog.setAttribute("aria-hidden", "false");
    root.classList.add("is-open"); // overlay catches clicks now
    lenisStop();
    document.addEventListener("keydown", onKeyDown);

    const d = reduceMotion ? 0 : 1; // duration multiplier
    const tl = gsap.timeline({
      onComplete: () => closeBtn.focus({ preventScroll: true }),
    });
    tl.to(overlay, { opacity: 1, duration: 0.3 * d, ease: "power2.out" }, 0)
      .fromTo(
        dialog,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 * d, ease: "power3.out" },
        0.05 * d
      )
      .fromTo(trail, { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 * d, ease: "power3.out" }, 0.1 * d)
      .fromTo(
        ".dlg-piece",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 * d, stagger: 0.08 * d, ease: "power3.out" },
        0.2 * d
      );
    if (reduceMotion) tl.progress(1); // jump to the end state
  }

  function closeDialog() {
    document.removeEventListener("keydown", onKeyDown);
    const done = () => {
      dialog.setAttribute("aria-hidden", "true");
      root.classList.remove("is-open");
      lenisStart();
      if (lastFocused) lastFocused.focus({ preventScroll: true });
    };
    if (reduceMotion) {
      gsap.set([overlay, dialog, trail], { opacity: 0 });
      gsap.set(".dlg-piece", { opacity: 0 });
      done();
      return;
    }
    gsap.timeline({ onComplete: done })
      .to(".dlg-piece", { opacity: 0, y: 10, duration: 0.2, ease: "power2.in" })
      .to(dialog, { opacity: 0, y: 30, duration: 0.25, ease: "power2.in" }, "-=0.1")
      .to([trail, overlay], { opacity: 0, duration: 0.25 }, "-=0.15");
  }

  // Lenis lives in main.js scope; reach it through the window-safe
  // helpers below (set on window by main.js). Keeps this file lean.
  function lenisStop() {
    if (window.__lenis) window.__lenis.stop();
  }
  function lenisStart() {
    if (window.__lenis) window.__lenis.start();
  }

  // Tile click: stacked layouts scroll to the visible panel,
  // full layout opens the modal over the dimmed page.
  tile.addEventListener("click", () => {
    if (isStacked()) {
      const target = root.querySelector(".dlg");
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -80 });
      else target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      openDialog();
    }
  });
  closeBtn.addEventListener("click", closeDialog);
  overlay.addEventListener("click", () => {
    if (root.classList.contains("is-open")) closeDialog();
  });

  // gsap.matchMedia runs one branch at a time and auto-cleans
  // the others on breakpoint change.
  const mm = gsap.matchMedia();

  /* Reduced motion: page rests with tile visible and panel in
     flow. The modal path above still works, instantly. */
  mm.add("(prefers-reduced-motion: reduce)", () => {});

  /* Desktop: the full pinned sequence. */
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.set(dialog, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-dialog",
          start: "top top", // pin the moment the section hits the top
          end: PIN_DISTANCE,
          pin: true,        // freeze the section while scrubbing
          scrub: MOTION.SCRUB, // smooth catch-up, not rigid 1:1
        },
      });

      /* 1. Page behind dims and blurs. backdropFilter tweens like
         any other CSS value, from sharp to soft. */
      tl.fromTo(
        overlay,
        { opacity: 0, backdropFilter: "blur(0px)" },
        { opacity: 1, backdropFilter: "blur(12px)", duration: 0.5, ease: MOTION.EASE_NONE }
      )
        /* 2. Dialog rises fast with a snappy ease, even scrubbed. */
        .fromTo(
          dialog,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: MOTION.EASE_SNAP },
          "-=0.15"
        )
        /* 3. Lime trail chases it upward from below. */
        .fromTo(
          trail,
          { y: 140, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: MOTION.EASE_NONE },
          "-=0.3"
        )
        /* 4. Title, bullets, button stagger in. */
        .fromTo(
          ".dlg-piece",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: MOTION.EASE_NONE },
          "-=0.3"
        )
        .to({}, { duration: 0.5 }) // hold: read the promise
        /* 5. All fades out, page continues. Tile waits underneath. */
        .to(dialog, { y: -30, opacity: 0, duration: 0.4, ease: MOTION.EASE_NONE })
        .to(
          [trail, overlay],
          { opacity: 0, backdropFilter: "blur(0px)", duration: 0.4, ease: MOTION.EASE_NONE },
          "-=0.25"
        );
    }
  );

  /* Mobile: same content, stacked, fading up as it enters view. */
  mm.add(
    "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.utils.toArray("#about-dialog .rise").forEach((el) => {
        gsap.fromTo(
          el,
          { y: MOTION.RISE_Y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.RISE_DURATION,
            ease: MOTION.EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }
  );
}
