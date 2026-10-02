/* ============================================================
   STAGE 1 - BUSINESS BASICS (pinned About chapter)
   Scroll sequence: 4 facts float in scattered, converge to the
   center, merge into one title (scale + blur crossfade), the title
   docks into a left column, and 4 detail rows stagger in on the
   right. Hold, then release.

   Desktop (>=768px): pinned section, scrubbed timeline.
   Mobile (<768px):   no pin, same content stacked with fade-ups.
   Reduced motion:    final docked state, static, no pin or scrub.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  title: "Who we are",
  facts: [
    { value: "1999", label: "Founded in Riverside" },
    { value: "6", label: "Districts served" },
    { value: "4", label: "Core services" },
    { value: "90 min", label: "Emergency response" },
  ],
  details: [
    { no: "01", label: "Founded 1999", desc: "Family run shop, same owners, same phone number since day one." },
    { no: "02", label: "Area served", desc: "Six districts with stocked vans, so parts ride along." },
    { no: "03", label: "What we fix", desc: "Repairs, drains and sewer, water heaters, full repipes." },
    { no: "04", label: "Response promise", desc: "90 minutes for emergencies, quotes within 48 hours." },
  ],
};

/* Scatter spots for the facts (desktop, % of the stage).
   Keep the middle clear: the title merges there. */
const SPOTS = [
  { left: "14%", top: "24%" },
  { left: "86%", top: "30%" },
  { left: "20%", top: "74%" },
  { left: "80%", top: "70%" },
];

/* Scrub feel, shared family (see motion.js). */
/* Extra scroll distance the pin holds, in viewport multiples. */
const PIN_DISTANCE = "+=300%";

export function initBasics() {
  const root = document.getElementById("about-basics");
  if (!root) return;

  // Render everything from CONTENT so copy edits stay in one place.
  root.querySelector(".bb-title-text").textContent = CONTENT.title;

  const scatter = root.querySelector(".bb-scatter");
  scatter.innerHTML = "";
  CONTENT.facts.forEach((fact, i) => {
    const card = document.createElement("div");
    card.className = "bb-fact rise";
    const spot = SPOTS[i % SPOTS.length];
    card.style.left = spot.left;
    card.style.top = spot.top;
    const value = document.createElement("p");
    value.className = "bb-fact-value";
    value.textContent = fact.value;
    const label = document.createElement("p");
    label.className = "bb-fact-label";
    label.textContent = fact.label;
    card.append(value, label);
    scatter.appendChild(card);
  });

  const details = root.querySelector(".bb-details");
  details.innerHTML = "";
  CONTENT.details.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bb-detail rise";
    const no = document.createElement("p");
    no.className = "bb-detail-no";
    no.textContent = item.no;
    const label = document.createElement("p");
    label.className = "bb-detail-label";
    label.textContent = item.label;
    const desc = document.createElement("p");
    desc.className = "bb-detail-desc";
    desc.textContent = item.desc;
    row.append(no, label, desc);
    details.appendChild(row);
  });

  // gsap.matchMedia runs one branch at a time and auto-cleans
  // the others on breakpoint change.
  const mm = gsap.matchMedia();

  /* Reduced motion: show the final docked state, statically.
     Facts already merged away in the story, details carry the
     same info, so facts rest hidden and title + details show. */
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".bb-fact", { opacity: 0 });
    gsap.set(".bb-title", { opacity: 1 });
    gsap.set(".bb-detail", { opacity: 1 });
  });

  /* Desktop: the full pinned sequence. */
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      const title = root.querySelector(".bb-title");
      const facts = gsap.utils.toArray(".bb-fact");

      // Center-anchored II: facts sit on their % spots, title sits
      // stage-center. xPercent/yPercent compose with x/y tweens,
      // so later moves stay exact.
      gsap.set(facts, { xPercent: -50, yPercent: -50 });
      gsap.set(title, { xPercent: -50, yPercent: -50 });

      // Pixel delta from an element's current center to a target.
      const toCenter = (el, cx, cy) => {
        const r = el.getBoundingClientRect();
        return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-basics",
          start: "top top",  // pin the moment the section hits the top
          end: PIN_DISTANCE, // hold: float, merge, dock, stack, rest
          pin: true,         // freeze the section while scrubbing
          scrub: MOTION.SCRUB, // smooth catch-up, not rigid 1:1
          onToggle: (self) =>
            gsap.set([title, ...facts], { willChange: self.isActive ? "transform" : "auto" }),
        },
      });

      /* 1. Facts float in one at a time, staying scattered. */
      tl.fromTo(
        facts,
        { y: MOTION.RISE_Y, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.4, ease: MOTION.EASE_NONE }
      )
        .to({}, { duration: 0.4 }); // beat: read all four facts

      /* 2. Converge to center, then merge into the title.
         Endpoints are functions, evaluated when each tween starts,
         so they use the live layout, never stale numbers. */
      tl.to(
        facts,
        {
          x: (i, el) => {
            const stage = root.getBoundingClientRect();
            return toCenter(el, stage.left + stage.width / 2, stage.top + stage.height / 2).x;
          },
          y: (i, el) => {
            const stage = root.getBoundingClientRect();
            return toCenter(el, stage.left + stage.width / 2, stage.top + stage.height / 2).y;
          },
          scale: 1.08,
          duration: 0.8,
          ease: MOTION.EASE_NONE,
        },
        ">-0.1"
      )
        .to(
          facts,
          { opacity: 0, filter: "blur(10px)", duration: 0.5, ease: MOTION.EASE_NONE },
          "-=0.3"
        )
        .fromTo(
          title,
          { opacity: 0, scale: 0.85, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: MOTION.EASE_NONE },
          "-=0.5"
        );

      /* 3 + 4. Title docks into the left column as the detail
         stack staggers in on the right. Same FLIP idea as the
         intro wordmark: measure, translate centers, scale widths. */
      tl.to(
        title,
        {
          x: () => {
            const slot = root.querySelector(".bb-slot").getBoundingClientRect();
            const r = title.getBoundingClientRect();
            return slot.left + slot.width / 2 - (r.left + r.width / 2);
          },
          y: () => {
            const slot = root.querySelector(".bb-slot").getBoundingClientRect();
            const r = title.getBoundingClientRect();
            return slot.top + slot.height / 2 - (r.top + r.height / 2);
          },
          scale: () => {
            const slot = root.querySelector(".bb-slot").getBoundingClientRect();
            return slot.width / title.getBoundingClientRect().width;
          },
          duration: 0.9,
          ease: MOTION.EASE_NONE,
        },
        ">-0.1"
      )
        .fromTo(
          ".bb-detail",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: MOTION.EASE_NONE },
          "-=0.55" // stack rises as the title settles
        )
        .to({}, { duration: 0.6 }); // 5. hold, then the pin releases
    }
  );

  /* Mobile: same content, stacked, fading up as it enters view. */
  mm.add(
    "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.utils.toArray("#about-basics .rise").forEach((el) => {
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
