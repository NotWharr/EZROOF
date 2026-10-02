/* ============================================================
   SITE FOOTER (sticky curtain reveal)
   The footer sits behind the page: main slides over it while
   you scroll, unveiling it at the very bottom like a curtain.
   Desktop: fixed 720px slot + fixed inner. Mobile: plain static.
   Reduced motion: static content, entrance skipped.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  brand: {
    first: "Copper",
    second: "line", // renders in accent green
    tagline: "Repairs, drains, heaters and repipes. Fixed right on the first visit.",
  },
  // Simple single-letter SVG marks, currentColor so they match text.
  socials: [
    {
      label: "Copperline on X",
      href: "https://x.com",
      path: "M4 4l7.2 9.3L4.4 20h2.5l5.4-5.6 4.3 5.6H20l-7.5-9.7L19.4 4h-2.5l-4.9 5.1L8 4H4z",
    },
    {
      label: "Copperline on Instagram",
      href: "https://instagram.com",
      path: "M12 8.8A3.2 3.2 0 1012 15.2 3.2 3.2 0 0012 8.8zm0-2.1a5.3 5.3 0 110 10.6 5.3 5.3 0 010-10.6zm6.8-.3a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zM12 4.2c2.5 0 2.8 0 3.8.1 2.7.1 3.9 1.4 4 4 .1 1 .1 1.2.1 3.7s0 2.8-.1 3.8c-.1 2.7-1.4 3.9-4 4-1 .1-1.2.1-3.8.1s-2.8 0-3.8-.1c-2.7-.1-3.9-1.4-4-4C5 15 5 14.7 5 12s0-2.8.1-3.8c.1-2.7 1.4-3.9 4-4C10.2 4.2 10.4 4.2 12 4.2z",
    },
    {
      label: "Copperline on Facebook",
      href: "https://facebook.com",
      path: "M13.5 20v-7h2.4l.4-3h-2.8V8.1c0-.9.3-1.5 1.6-1.5h1.3V3.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V10H8.5v3H11v7h2.5z",
    },
    {
      label: "Copperline on LinkedIn",
      href: "https://linkedin.com",
      path: "M6.9 8.6H4V20h2.9V8.6zM5.4 7.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM10 20v-6c0-1.5.7-2.6 2.2-2.6 1.4 0 2 1 2 2.6v6h2.9v-6.4c0-2.9-1.5-4.4-3.9-4.4-1.5 0-2.5.8-3 1.7V8.6H7.3c0 .8 0 11.4 0 11.4H10z",
    },
  ],
  columns: [
    {
      heading: "Services",
      links: [
        { label: "Emergency repair", href: "#work" },
        { label: "Drains and sewer", href: "#work" },
        { label: "Water heaters", href: "#work" },
        { label: "Repipes", href: "#work" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#about-owner" },
        { label: "Our promise", href: "#about-dialog" },
        { label: "Credentials", href: "#about-tabs" },
        { label: "Numbers", href: "#about-numbers" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Cost estimator", href: "#contact" },
        { label: "Get an estimate", href: "#contact" },
        { label: "Emergencies", href: "#contact" },
        { label: "Reviews", href: "#contact" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "(555) 014-7663", href: "tel:+15550147663" },
        { label: "hello@copperline.com", href: "mailto:hello@copperline.com" },
        { label: "2400 Industrial Way, Riverside", href: "#contact" },
        { label: "Mon-Fri 7AM-6PM, Sat 8AM-2PM", href: "#contact" },
      ],
    },
  ],
  bottom: {
    legal: "© 2026 Copperline. Concept website, not a real business.",
    credit: "Designed and built by [MY NAME]",
  },
};

export function initFooter() {
  const root = document.querySelector(".site-footer");
  if (!root) return;

  // Render everything from CONTENT so copy edits stay in one place.
  const brand = root.querySelector(".foot-brand");
  const mark = document.createElement("p");
  mark.className = "wordmark foot-mark";
  const first = document.createElement("span");
  first.textContent = CONTENT.brand.first;
  const second = document.createElement("span");
  second.className = "foot-lime";
  second.textContent = CONTENT.brand.second;
  mark.append(first, second);
  const tag = document.createElement("p");
  tag.className = "foot-tag";
  tag.textContent = CONTENT.brand.tagline;
  const socials = document.createElement("div");
  socials.className = "foot-socials";
  CONTENT.socials.forEach((s) => {
    const a = document.createElement("a");
    a.href = s.href;
    a.setAttribute("aria-label", s.label);
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${s.path}" /></svg>`;
    socials.appendChild(a);
  });
  brand.append(mark, tag, socials);

  const cols = root.querySelector(".foot-cols");
  cols.innerHTML = "";
  CONTENT.columns.forEach((col) => {
    const group = document.createElement("div");
    group.className = "foot-col foot-block";
    const heading = document.createElement("h3");
    heading.className = "foot-heading";
    heading.textContent = col.heading;
    const list = document.createElement("ul");
    list.className = "foot-links";
    col.links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      li.appendChild(a);
      list.appendChild(li);
    });
    group.append(heading, list);
    cols.appendChild(group);
  });

  const bottom = root.querySelector(".foot-bottom");
  const legal = document.createElement("p");
  legal.textContent = CONTENT.bottom.legal;
  const credit = document.createElement("p");
  credit.textContent = CONTENT.bottom.credit;
  bottom.append(legal, credit);

  // Brand block animates too; columns carry .foot-block from markup.
  brand.classList.add("foot-block");

  // Entrance runs for desktop curtain AND mobile static alike.
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", () => {}); // static, done
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(
      ".site-footer .foot-block",
      { opacity: 0, y: -8, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: MOTION.EASE_OUT,
        stagger: 0.1,
        // Fires while the curtain opens (not exact-bottom: fractional
        // pin math can make "bottom bottom" unreachable by a pixel).
        scrollTrigger: { trigger: ".site-footer", start: "top 92%", once: true },
      }
    );
  });
}
