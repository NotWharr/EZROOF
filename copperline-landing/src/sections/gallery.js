/* ============================================================
   LENS RAIL GALLERY (drag sideways, center card magnifies)
   A flex track of photo cards. Draggable moves it on x with
   inertia + end snap. Every frame the lens maps each card's
   distance from viewport center to a scale, so the middle card
   grows like a magnifying glass while neighbors shrink aside.

   Transform + opacity only. Mobile: smaller cards, gentler lens.
   Reduced motion: plain drag, everything rests at scale 1.
   ============================================================ */

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";
import img1 from "../assets/gallery/1.webp";
import img2 from "../assets/gallery/2.webp";
import img3 from "../assets/gallery/3.webp";
import img4 from "../assets/gallery/4.webp";
import img5 from "../assets/gallery/5.webp";
import img6 from "../assets/gallery/6.webp";
import img7 from "../assets/gallery/7.webp";
import img8 from "../assets/gallery/8.webp";

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  eyebrow: "Recent work",
  title: "Jobs still holding today.",
  items: [
    { img: img1, job: "Repipe", location: "Riverside" },
    { img: img2, job: "Bath remodel", location: "Hillcrest" },
    { img: img3, job: "Fixture swap", location: "Northside" },
    { img: img4, job: "Tub trim", location: "Lakeshore" },
    { img: img5, job: "Sewer renewal", location: "Milltown" },
    { img: img6, job: "Drain rescue", location: "Westbrook" },
    { img: img7, job: "Heater install", location: "Riverside" },
    { img: img8, job: "Rough-in", location: "Northside" },
  ],
};

/* Lens tuning. MAX = center scale, RANGE = reach in card widths. */
const LENS_MAX = 1.5;
const LENS_MAX_MOBILE = 1.25;
const LENS_RANGE = 1.2;
const GAP = 20; // must match the CSS track gap

export function initGallery() {
  const root = document.getElementById("work");
  if (!root) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

  // Render everything from CONTENT so copy edits stay in one place.
  root.querySelector(".rail-eyebrow").textContent = CONTENT.eyebrow;
  root.querySelector(".rail-title").textContent = CONTENT.title;
  const track = root.querySelector(".rail-track");
  track.innerHTML = "";
  const cards = CONTENT.items.map((item, i) => {
    const card = document.createElement("figure");
    card.className = "rail-card";
    card.tabIndex = 0; // focusable: arrow keys glide between cards
    card.setAttribute("aria-label", `${item.job}, ${item.location}`);
    card.dataset.i = i;
    const frame = document.createElement("span");
    frame.className = "rail-frame";
    const photo = document.createElement("img");
    photo.src = item.img;
    photo.alt = `${item.job} in ${item.location}`;
    photo.width = 520; // 2x display size, reserves space before load
    photo.height = 680;
    photo.loading = "lazy";
    frame.appendChild(photo);
    const cap = document.createElement("figcaption");
    cap.className = "rail-cap";
    cap.textContent = `${item.job} - ${item.location}`;
    card.append(frame, cap);
    track.appendChild(card);
    return card;
  });

  const viewport = root.querySelector(".rail-viewport");
  const progressFill = root.querySelector(".rail-progress-fill");
  const prevBtn = root.querySelector(".rail-prev");
  const nextBtn = root.querySelector(".rail-next");
  const pill = root.querySelector(".drag-pill");

  // Per-card painters, created once. The ticker calls these every
  // frame instead of building tweens, which stays cheap for 8 cards.
  const painters = cards.map((card) => ({
    scale: gsap.quickSetter(card, "scale"),
    x: gsap.quickSetter(card, "x"),
    opacity: gsap.quickSetter(card, "opacity"),
    el: card,
  }));

  // Layout numbers, remeasured on resize + image load.
  const geom = { step: 280, cardW: 260, minX: 0 };
  function measure() {
    const cardW = cards[0].offsetWidth;
    const step = cards[1].offsetLeft - cards[0].offsetLeft || cardW + GAP;
    // End padding lets the first AND last card each reach center.
    const pad = viewport.clientWidth / 2 - cardW / 2;
    track.style.paddingInline = `${Math.max(pad, 0)}px`;
    geom.step = step;
    geom.cardW = cardW;
    geom.minX = -(cards.length - 1) * step;
    if (draggable) draggable.applyBounds({ minX: geom.minX, maxX: 0 });
    gsap.set(track, { x: gsap.utils.clamp(geom.minX, 0, gsap.getProperty(track, "x")) });
    updateLens();
  }

  /* The lens: distance from viewport center maps to scale with a
     power2 falloff, so growth feels smooth, never stepped.
     Neighbors get shoved outward so the big card never covers them. */
  let focusIndex = -1;
  function updateLens() {
    if (reduceMotion) return;
    const max = isMobile() ? LENS_MAX_MOBILE : LENS_MAX;
    const cx = window.innerWidth / 2;
    const range = geom.cardW * LENS_RANGE;
    // Pass 1: scales, so we know how big the center card is.
    let centerScale = 1;
    const dists = painters.map((p) => {
      const r = p.el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - cx);
      const t = Math.min(dist / range, 1); // 0 center, 1 far
      const s = 1 + (max - 1) * (1 - t) * (1 - t); // power2 falloff
      if (s > centerScale) centerScale = s;
      return { p, dist, t, s };
    });
    // Pass 2: paint scale, dim, depth + push neighbors apart.
    dists.forEach(({ p, dist, t, s }) => {
      p.scale(s);
      p.opacity(0.6 + 0.4 * (1 - t) * (1 - t));
      p.el.style.zIndex = String(1 + Math.round((s - 1) * 20));
      const r = p.el.getBoundingClientRect();
      const dir = r.left + r.width / 2 >= cx ? 1 : -1;
      const near = Math.max(0, 1 - dist / (geom.cardW * 2.5));
      p.x(dir * (centerScale - 1) * geom.cardW * 0.35 * near);
    });
    // Lime ring marks whichever card owns the center.
    let best = 0;
    let bestDist = Infinity;
    painters.forEach((p, i) => {
      const r = p.el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - cx);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (best !== focusIndex) {
      focusIndex = best;
      painters.forEach((p, i) => p.el.classList.toggle("is-focus", i === best));
    }
    // Progress line: 0 at first card centered, 1 at last.
    const x = gsap.getProperty(track, "x");
    const prog = geom.minX === 0 ? 1 : x / geom.minX;
    gsap.set(progressFill, { scaleX: gsap.utils.clamp(0, 1, prog) });
  }

  // Glide a card index to the exact center.
  function goTo(i, duration = 0.6) {
    const clamped = gsap.utils.clamp(0, cards.length - 1, Math.round(i));
    gsap.to(track, {
      x: -clamped * geom.step,
      duration: reduceMotion ? 0 : duration,
      ease: "expo.out",
      overwrite: "auto",
    });
    return clamped;
  }
  function centeredIndex() {
    const x = gsap.getProperty(track, "x");
    return gsap.utils.clamp(0, cards.length - 1, Math.round(-x / geom.step));
  }

  /* Draggable owns the x axis: drag, inertia glide, end snap.
     onDrag/onThrowUpdate repaint the lens mid-flight; the ticker
     covers button glides, clicks and keyboard moves. */
  const draggable = Draggable.create(track, {
    type: "x",
    bounds: { minX: geom.minX, maxX: 0 },
    inertia: !reduceMotion,
    snap: reduceMotion
      ? false
      : { x: (x) => gsap.utils.clamp(geom.minX, 0, Math.round(-x / geom.step) * -geom.step) },
    zIndexBoost: false, // lens owns z-index, Draggable must not fight it
    onDrag: updateLens,
    onThrowUpdate: updateLens,
    onPress: () => viewport.classList.add("is-dragging"),
    onRelease: () => viewport.classList.remove("is-dragging"),
    onClick: (e) => {
      const card = e.target.closest(".rail-card");
      if (card) goTo(Number(card.dataset.i));
    },
  })[0];

  gsap.ticker.add(updateLens); // follows every motion source

  // Trackpad / shift-wheel moves the rail, page keeps the rest.
  // Lenis ignores horizontal gestures here (data-lenis-prevent-horizontal)
  // but still smooth-scrolls vertical ones, so only hijack a CLEARLY
  // horizontal shove. Diagonal scrolling stays with the page: killing
  // it would eat the vertical component and glue the page in place.
  viewport.addEventListener(
    "wheel",
    (e) => {
      const ax = Math.abs(e.deltaX);
      const ay = Math.abs(e.deltaY);
      if (ax < 4 || ax <= ay * 2) return; // not ours: vertical, noise, diagonal
      e.preventDefault();
      const x = gsap.getProperty(track, "x") - e.deltaX * 1.5;
      gsap.to(track, {
        x: gsap.utils.clamp(geom.minX, 0, reduceMotion ? x : Math.round(-x / geom.step) * -geom.step),
        duration: reduceMotion ? 0 : 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    { passive: false }
  );

  // Arrows glide between cards (and move focus along).
  viewport.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = goTo(centeredIndex() + (e.key === "ArrowRight" ? 1 : -1));
    cards[next].focus({ preventScroll: true });
  });
  prevBtn.addEventListener("click", () => goTo(centeredIndex() - 1));
  nextBtn.addEventListener("click", () => goTo(centeredIndex() + 1));

  // "Drag" pill chases the cursor over the rail (fine pointers only).
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && pill) {
    const pillX = gsap.quickTo(pill, "x", { duration: 0.3, ease: "power3" });
    const pillY = gsap.quickTo(pill, "y", { duration: 0.3, ease: "power3" });
    viewport.addEventListener("mousemove", (e) => {
      pillX(e.clientX + 16);
      pillY(e.clientY + 16);
      pill.classList.add("is-on");
    });
    viewport.addEventListener("mouseleave", () => pill.classList.remove("is-on"));
  }

  // Entrance: cards rise in staggered, center card already lensed.
  if (!reduceMotion) {
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: MOTION.EASE_OUT,
        stagger: MOTION.RISE_STAGGER,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
        onComplete: updateLens,
      }
    );
  }

  // Late images + resizes shift geometry: remeasure everything.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      ScrollTrigger.refresh();
    }, 200);
  });
  Promise.all(
    cards.map((card) => {
      const img = card.querySelector("img");
      return img.complete
        ? null
        : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
    })
  ).then(() => {
    measure();
    ScrollTrigger.refresh();
  });
  measure();
}
