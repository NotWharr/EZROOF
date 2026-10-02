/* ============================================================
   STAGE 5 - NUMBERS (count-up stats row)
   Four stats count from 0 when scrolled into view, each with a
   lime underline that draws itself underneath. Fires once only.

   No pin here: a plain enter-viewport trigger is all it needs.
   Mobile: same behavior, 2-up grid. Reduced motion: final
   values shown instantly, underline already drawn.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
// value = count target. decimals = digits after the point.
// prefix/suffix dress it up ("$" / " min"). label sits below.
const CONTENT = {
  stats: [
    { value: 27, decimals: 0, prefix: "", suffix: " yrs", label: "In business" },
    { value: 12400, decimals: 0, prefix: "", suffix: "", label: "Jobs done" },
    { value: 4.9, decimals: 1, prefix: "", suffix: "", label: "Average rating" },
    { value: 90, decimals: 0, prefix: "", suffix: " min", label: "Emergency response" },
  ],
};

/* How the big numbers print: thousands separators + fixed decimals. */
function format(value, decimals) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function initNumbers() {
  const root = document.getElementById("about-numbers");
  if (!root) return;

  // Render everything from CONTENT so copy edits stay in one place.
  const grid = root.querySelector(".num-grid");
  grid.innerHTML = "";
  const counters = CONTENT.stats.map((stat) => {
    const item = document.createElement("div");
    item.className = "num-stat rise";
    const number = document.createElement("p");
    number.className = "num-value";
    number.textContent = `${stat.prefix}${format(0, stat.decimals)}${stat.suffix}`;
    const bar = document.createElement("span");
    bar.className = "num-bar";
    bar.setAttribute("aria-hidden", "true");
    const label = document.createElement("p");
    label.className = "num-label";
    label.textContent = stat.label;
    item.append(number, bar, label);
    grid.appendChild(item);
    return { stat, number, bar, item };
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reduced motion: final values, drawn underlines, nothing moves. */
  if (reduceMotion) {
    counters.forEach(({ stat, number, bar }) => {
      number.textContent = `${stat.prefix}${format(stat.value, stat.decimals)}${stat.suffix}`;
      gsap.set(bar, { scaleX: 1 });
    });
    return;
  }

  /* One trigger per stat: fade the block up, run the count, then
     draw the lime underline beneath it. once:true = never replays. */
  counters.forEach(({ stat, number, bar, item }) => {
    const counter = { v: 0 }; // tweened object, painted onUpdate
    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          item,
          { y: MOTION.RISE_Y, opacity: 0 },
          { y: 0, opacity: 1, duration: MOTION.RISE_DURATION, ease: MOTION.EASE_OUT }
        );
        gsap.to(counter, {
          v: stat.value,
          duration: 1.6,
          ease: "power2.out", // fast start, gentle landing on the number
          onUpdate: () => {
            number.textContent = `${stat.prefix}${format(counter.v, stat.decimals)}${stat.suffix}`;
          },
        });
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.out", delay: 0.9 }
        );
      },
    });
  });
}
