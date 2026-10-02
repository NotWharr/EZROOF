/* ============================================================
   STAGE 4 - CREDENTIALS / VALUES TABS (pinned tab chapter)
   A tab bar with a sliding lime pill. An SVG "neck" melts the
   pill into the panel below: its bezier control points tween
   with the pill, with a short overshoot for a gooey feel.
   Scroll auto-advances (first half Credentials, second half
   Values); clicking and arrow keys work any time.

   Desktop (>=768px): pinned section, scroll drives the tab.
   Mobile (<768px):   no pin, stacked layout, fade-up reveals.
   Reduced motion:    static, instant tab switches.
   ============================================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  tabs: ["Credentials", "Values"],
  credentials: [
    { title: "Licensed C-36", desc: "State plumbing license, verified and current." },
    { title: "$2M insured", desc: "Liability and workers comp on every job." },
    { title: "Factory certified", desc: "Trained on the heaters we install." },
    { title: "5-year warranty", desc: "Labor covered in writing, not spoken." },
  ],
  values: [
    { title: "Upfront pricing", desc: "Flat written quotes. The invoice matches or the extra is free." },
    { title: "Tidy vans, tidy homes", desc: "Shoe covers, drop cloths, tested fixtures before we leave." },
    { title: "Answer the phone", desc: "Humans on the line, 90 minutes for emergencies." },
  ],
};

/* Pill overshoot: short and snappy, never loose. Deliberately NOT
   the shared ease: goo needs its own spring. */
const PILL_EASE = "back.out(1.5)";
const PILL_DURATION = 0.5;
/* Scrub feel, shared family (see motion.js). */
/* Extra scroll distance the pin holds, in viewport multiples. */
const PIN_DISTANCE = "+=200%";
/* Pill padding around the active tab label. */
const PILL_PAD = 10;
/* Neck curve tuning: pinch pulls the sides inward (concave),
   flare spreads the feet where it meets the panel. */
const NECK_PINCH = 20;
const NECK_FOOT = 28;

export function initTabs() {
  const root = document.getElementById("about-tabs");
  if (!root) return;
  const wrap = root.querySelector(".tabs-wrap");
  const tabbar = root.querySelector(".tabbar");
  const pill = root.querySelector(".tab-pill");
  const neck = root.querySelector(".tab-neck");
  const neckPath = root.querySelector(".tab-neck-path");
  const panelsBox = root.querySelector(".tab-panels");

  // Render tabs + panels from CONTENT so copy edits stay in one place.
  tabbar.querySelectorAll(".tab").forEach((btn, i) => btn.remove());
  const tabBtns = CONTENT.tabs.map((label, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab rise";
    btn.id = `tab-${i}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.setAttribute("aria-controls", `panel-${i}`);
    btn.tabIndex = i === 0 ? 0 : -1; // roving tabindex: one stop
    btn.textContent = label;
    tabbar.appendChild(btn);
    return btn;
  });

  const panelData = [CONTENT.credentials, CONTENT.values];
  panelsBox.querySelectorAll(".tabpanel").forEach((p) => p.remove());
  const panels = panelData.map((items, i) => {
    const panel = document.createElement("div");
    panel.className = "tabpanel";
    panel.id = `panel-${i}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab-${i}`);
    panel.tabIndex = 0;
    if (i === 0) panel.classList.add("rise");
    const list = document.createElement("ul");
    list.className = i === 0 ? "cred-grid" : "value-list";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = i === 0 ? "cred-badge" : "value-row";
      const title = document.createElement("p");
      title.className = i === 0 ? "cred-title" : "value-title";
      title.textContent = item.title;
      const desc = document.createElement("p");
      desc.className = i === 0 ? "cred-desc" : "value-desc";
      desc.textContent = item.desc;
      li.append(title, desc);
      list.appendChild(li);
    });
    panel.appendChild(list);
    panelsBox.appendChild(panel);
    return panel;
  });

  let active = 0;      // currently shown tab
  let scrollHalf = 0;  // last half set by scroll (clicks don't touch it)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Pill state in wrap coordinates. Tweened, then painted.
  const pillState = { x0: 0, x1: 0 };

  /* Measure the active tab and place the pill behind it. */
  function paintPill() {
    pill.style.transform = `translateX(${pillState.x0}px)`;
    pill.style.width = `${pillState.x1 - pillState.x0}px`;
    drawNeck();
  }

  function measurePill(i) {
    // Pill lives inside the tabbar (absolute), so measure the tab
    // against the tabbar, not the outer wrap.
    const barBox = tabbar.getBoundingClientRect();
    const tabBox = tabBtns[i].getBoundingClientRect();
    return {
      x0: tabBox.left - barBox.left - PILL_PAD,
      x1: tabBox.right - barBox.left + PILL_PAD,
    };
  }

  /* Rebuild the neck path from the pill's live edges down to the
     panel's top edge. Concave sides: each edge bows inward
     mid-way, then flares to its foot on the panel. */
  function drawNeck() {
    const wrapBox = wrap.getBoundingClientRect();
    const panelBox = panelsBox.getBoundingClientRect();
    const pillBottom = tabbar.getBoundingClientRect().bottom - wrapBox.top;
    const top = panelBox.top - wrapBox.top;
    const footL = panelBox.left - wrapBox.left + NECK_FOOT;
    const footR = panelBox.right - wrapBox.left - NECK_FOOT;
    const h = Math.max(top - pillBottom, 0);
    // Pill state is tabbar-relative; the neck draws in wrap
    // coordinates, so add the tabbar's own offset inside the wrap.
    const barLeft = tabbar.getBoundingClientRect().left - wrapBox.left;
    const x0 = barLeft + pillState.x0;
    const x1 = barLeft + pillState.x1;

    neck.setAttribute("viewBox", `0 0 ${wrapBox.width} ${wrapBox.height}`);
    neckPath.setAttribute(
      "d",
      `M ${x0},${pillBottom} ` +
        `C ${x0 + NECK_PINCH},${pillBottom + h * 0.4} ` +
        `${footL + NECK_PINCH * 0.3},${pillBottom + h * 0.6} ` +
        `${footL},${top} ` +
        `L ${footR},${top} ` +
        `C ${footR - NECK_PINCH * 0.3},${pillBottom + h * 0.6} ` +
        `${x1 - NECK_PINCH},${pillBottom + h * 0.4} ` +
        `${x1},${pillBottom} Z`
    );
  }

  /* Fix the panel box to the tallest panel so switching tabs
     never jumps the layout (desktop absolute stack only).
     Re-run on resize + font load. */
  function sizePanels() {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop) {
      panelsBox.style.height = "";
      showPanel(active, true);
      return;
    }
    const hidden = panels.filter((p) => p.hasAttribute("hidden"));
    hidden.forEach((p) => p.removeAttribute("hidden"));
    const max = Math.max(...panels.map((p) => p.offsetHeight));
    panelsBox.style.height = `${max}px`;
    hidden.forEach((p) => p.setAttribute("hidden", ""));
    showPanel(active, true);
    const m = measurePill(active);
    pillState.x0 = m.x0;
    pillState.x1 = m.x1;
    paintPill();
  }
  sizePanels(); // first paint now, fonts + resize re-run it

  /* Swap panels: outgoing fades up and away, incoming rises in. */
  function showPanel(i, instant = false) {
    panels.forEach((panel, k) => {
      if (k === i) {
        panel.removeAttribute("hidden");
        if (instant) {
          gsap.set(panel, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            panel,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto", // fast clicking never stacks two panels
            }
          );
        }
      } else if (!panel.hasAttribute("hidden")) {
        if (instant) {
          panel.setAttribute("hidden", "");
        } else {
          gsap.to(panel, {
            opacity: 0,
            y: -12,
            duration: 0.2,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => panel.setAttribute("hidden", ""),
          });
        }
      }
    });
  }

  /* The one way to change tabs: a11y state, pill flight, panel. */
  function selectTab(i, instant = false) {
    active = i;
    tabBtns.forEach((btn, k) => {
      btn.setAttribute("aria-selected", k === i ? "true" : "false");
      btn.tabIndex = k === i ? 0 : -1;
    });
    const m = measurePill(i);
    if (instant) {
      gsap.set(pillState, { x0: m.x0, x1: m.x1 });
      paintPill();
    } else {
      gsap.to(pillState, {
        x0: m.x0,
        x1: m.x1,
        duration: PILL_DURATION,
        ease: PILL_EASE, // short overshoot, neck bends along
        overwrite: "auto",
        onUpdate: paintPill,
      });
    }
    showPanel(i, instant);
  }

  tabBtns.forEach((btn, i) => btn.addEventListener("click", () => selectTab(i)));

  /* Keyboard: arrows move + select, Home/End jump. */
  tabbar.addEventListener("keydown", (event) => {
    const k = event.key;
    let next = null;
    if (k === "ArrowRight" || k === "ArrowDown") next = (active + 1) % tabBtns.length;
    else if (k === "ArrowLeft" || k === "ArrowUp") next = (active - 1 + tabBtns.length) % tabBtns.length;
    else if (k === "Home") next = 0;
    else if (k === "End") next = tabBtns.length - 1;
    if (next === null) return;
    event.preventDefault();
    selectTab(next);
    tabBtns[next].focus();
  });

  // Keep pill + neck + panel heights honest on resize and late fonts.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizePanels, 200);
  });
  document.fonts.ready.then(sizePanels);

  const mm = gsap.matchMedia();

  /* Reduced motion: static page, tabs switch instantly. */
  mm.add("(prefers-reduced-motion: reduce)", () => {
    selectTab(0, true);
  });

  /* Desktop: pin + auto-advance. First half Credentials,
     second half Values. Clicks switch immediately; scrolling
     only overrides when it crosses into the other half. */
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      selectTab(0, true);
      ScrollTrigger.create({
        trigger: "#about-tabs",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: MOTION.SCRUB,
        onUpdate: (self) => {
          const half = self.progress < 0.5 ? 0 : 1;
          if (half !== scrollHalf) {
            scrollHalf = half;
            selectTab(half);
          }
        },
      });
    }
  );

  /* Mobile: stacked, fade-up reveals, tap to switch. */
  mm.add(
    "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    () => {
      selectTab(0, true);
      gsap.utils.toArray("#about-tabs .rise").forEach((el) => {
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
