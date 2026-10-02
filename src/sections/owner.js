/* ============================================================
   STAGE 2 - THE OWNER (pinned headline with growing photo)
   A centered headline reads "About [photo] The Owner". The photo
   slot opens from 0 to full size, shoving the words apart, the
   photo settles from a zoom, then bio + quote rise from masks.

   Desktop (>=768px): pinned section, scrubbed timeline.
   Mobile (<768px):   no pin, stacked layout, fade-up reveals.
   Reduced motion:    final state, static, no pin or scrub.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";
import ownerPhoto from "../assets/owner.webp"; // bundled by Vite, hashed into dist

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  lead: "About",
  tail: "The Owner",
  img: ownerPhoto, // to swap the photo, replace src/assets/owner.webp
  imgAlt: "Portrait of the Copperline founder",
  bio: [
    "Third-generation plumber, first-generation paperwork hater.",
    "Still rides along on Friday calls.",
  ],
  quote: ["Fix it once,", "fix it right."],
  attribution: "Michael Torres - Founder",
};

/* Slot open size (desktop). Words are pushed apart by the growth. */
const OPEN_WIDTH = "34vw";
const OPEN_HEIGHT = "50vh";
/* Scrub feel, shared family (see motion.js). */
/* Extra scroll distance the pin holds, in viewport multiples. */
const PIN_DISTANCE = "+=200%";

export function initOwner() {
  const root = document.getElementById("about-owner");
  if (!root) return;

  // Render everything from CONTENT so copy edits stay in one place.
  root.querySelector(".ow-lead").textContent = CONTENT.lead;
  root.querySelector(".ow-tail").textContent = CONTENT.tail;
  const photo = root.querySelector(".ow-photo");
  photo.src = CONTENT.img;
  photo.alt = CONTENT.imgAlt;

  const bioBox = root.querySelector(".ow-bio");
  bioBox.innerHTML = "";
  CONTENT.bio.forEach((text) => {
    const mask = document.createElement("span");
    mask.className = "mask";
    const inner = document.createElement("span");
    inner.className = "mask-inner ow-line rise";
    inner.textContent = text;
    mask.appendChild(inner);
    bioBox.appendChild(mask);
  });

  const quoteBox = root.querySelector(".ow-quote");
  quoteBox.innerHTML = "";
  CONTENT.quote.forEach((text) => {
    const mask = document.createElement("span");
    mask.className = "mask";
    const inner = document.createElement("span");
    inner.className = "mask-inner ow-line rise";
    inner.textContent = text;
    mask.appendChild(inner);
    quoteBox.appendChild(mask);
  });
  const attr = document.createElement("footer");
  attr.className = "ow-attr rise";
  attr.textContent = CONTENT.attribution;
  quoteBox.appendChild(attr);

  // gsap.matchMedia runs one branch at a time and auto-cleans
  // the others on breakpoint change.
  const mm = gsap.matchMedia();

  /* Reduced motion: final state, static. The slot rests open via
     the stacked base CSS, photo unzoomed, text fully visible. */
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".ow-slot", { width: "100%", height: "40vh" });
    gsap.set(photo, { scale: 1 });
  });

  /* Desktop: the full pinned sequence. */
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-owner",
          start: "top top", // pin the moment the section hits the top
          end: PIN_DISTANCE,
          pin: true,        // freeze the section while scrubbing
          scrub: MOTION.SCRUB, // smooth catch-up, not rigid 1:1
          onToggle: (self) =>
            gsap.set(photo, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });

      /* 1. Slot grows 0 to open. Width/height on purpose here:
         the flex row reflows, so the words get physically pushed
         apart left and right. (Transform couldn't move siblings.) */
      tl.fromTo(
        ".ow-slot",
        { width: 0, height: 0 },
        { width: OPEN_WIDTH, height: OPEN_HEIGHT, duration: 1, ease: MOTION.EASE_NONE }
      )
        /* 2. Photo settles from a slight zoom as the slot opens. */
        .fromTo(
          photo,
          { scale: 1.3 },
          { scale: 1, duration: 0.8, ease: MOTION.EASE_NONE },
          "-=0.7"
        )
        /* 3. Bio + quote rise from masks, hero-text style. */
        .fromTo(
          ".ow-line",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, stagger: 0.12, ease: MOTION.EASE_NONE },
          "-=0.3"
        )
        .fromTo(
          ".ow-attr",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: MOTION.EASE_NONE },
          "-=0.2"
        )
        .to({}, { duration: 0.5 }); // hold, then the pin releases
    }
  );

  /* Mobile: same content, stacked, fading up as it enters view. */
  mm.add(
    "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.utils.toArray("#about-owner .rise").forEach((el) => {
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
