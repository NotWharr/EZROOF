import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { TABS } from "../content";
import { MOTION } from "../lib/motion";
gsap.registerPlugin(ScrollTrigger);

// Credentials / Values tabs: sliding lime pill melting into the panel
// through an elastic SVG neck. Scroll auto-advances the halves.
export default function Tabs() {
  const rootRef = useRef<HTMLElement>(null);
  const tabbarRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const neckRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const pillState = useRef({ x0: 0, x1: 0 });
  const scrollHalf = useRef(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  const items = [TABS.credentials, TABS.values] as const;

  // Position the pill behind tab i and redraw the neck.
  function paint(tabbar: HTMLElement, wrap: HTMLElement, panels: HTMLElement, state: { x0: number; x1: number }) {
    const pill = pillRef.current;
    const path = neckRef.current;
    const svg = svgRef.current;
    if (!pill || !path || !svg) return;
    pill.style.transform = `translateX(${state.x0}px)`;
    pill.style.width = `${state.x1 - state.x0}px`;
    const wrapBox = wrap.getBoundingClientRect();
    const barBox = tabbar.getBoundingClientRect();
    const panelBox = panels.getBoundingClientRect();
    const pillBottom = barBox.bottom - wrapBox.top;
    const top = panelBox.top - wrapBox.top;
    const footL = panelBox.left - wrapBox.left + 28;
    const footR = panelBox.right - wrapBox.left - 28;
    const h = Math.max(top - pillBottom, 0);
    const barLeft = barBox.left - wrapBox.left;
    const x0 = barLeft + state.x0;
    const x1 = barLeft + state.x1;
    svg.setAttribute("viewBox", `0 0 ${wrapBox.width} ${wrapBox.height}`);
    path.setAttribute(
      "d",
      `M ${x0},${pillBottom} ` +
        `C ${x0 + 20},${pillBottom + h * 0.4} ${footL + 6},${pillBottom + h * 0.6} ${footL},${top} ` +
        `L ${footR},${top} ` +
        `C ${footR - 6},${pillBottom + h * 0.6} ${x1 - 20},${pillBottom + h * 0.4} ${x1},${pillBottom} Z`,
    );
  }

  function measure(i: number) {
    const tabbar = tabbarRef.current;
    const wrap = rootRef.current?.querySelector<HTMLElement>(".tabs-wrap");
    const tab = tabbar?.querySelectorAll<HTMLElement>(".tab")[i];
    if (!tabbar || !wrap || !tab) return null;
    const barBox = tabbar.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    return { x0: tabBox.left - barBox.left - 10, x1: tabBox.right - barBox.left + 10 };
  }

  function selectTab(i: number, instant = false) {
    const tabbar = tabbarRef.current;
    const wrap = rootRef.current?.querySelector<HTMLElement>(".tabs-wrap");
    const panels = panelsRef.current;
    if (!tabbar || !wrap || !panels) return;
    setActive(i);
    const m = measure(i);
    if (!m) return;
    if (instant || reduceMotion) {
      pillState.current = { ...m };
      paint(tabbar, wrap, panels, pillState.current);
    } else {
      gsap.set(pillRef.current, { willChange: "transform, width" });
      gsap.to(pillState.current, {
        x0: m.x0,
        x1: m.x1,
        duration: 0.5,
        ease: "back.out(1.5)",
        overwrite: "auto",
        onUpdate: () => {
          const w = rootRef.current?.querySelector<HTMLElement>(".tabs-wrap");
          const p = panelsRef.current;
          if (tabbarRef.current && w && p) paint(tabbarRef.current, w, p, pillState.current);
        },
        onComplete: () => gsap.set(pillRef.current, { willChange: "auto" }),
      });
    }
  }

  // Pin + auto-advance on desktop with motion; size panels; repaint.
  // Mobile gets fade-ups; reduced motion gets an instant static tab.
  useEffect(() => {
    const root = rootRef.current;
    const panels = panelsRef.current;
    if (!root || !panels) return;
    const panelsEl: HTMLElement = panels;
    selectTab(0, true);
    if (reduceMotion) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("#about-tabs .rise").forEach((el) => {
          gsap.fromTo(
            el,
            { y: MOTION.RISE_Y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION.RISE_DURATION,
              ease: MOTION.EASE_OUT,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });
      }, root);
      return () => ctx.revert();
    }
    const st = ScrollTrigger.create({
      trigger: "#about-tabs",
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: MOTION.SCRUB,
      onUpdate: (self) => {
        const half = self.progress < 0.5 ? 0 : 1;
        if (half !== scrollHalf.current) {
          scrollHalf.current = half;
          // Measure fresh inside: layout is frozen mid-pin.
          const tabbar = tabbarRef.current;
          const wrap = root.querySelector<HTMLElement>(".tabs-wrap");
          if (!tabbar || !wrap) return;
          const tab = tabbar.querySelectorAll<HTMLElement>(".tab")[half];
          if (!tab) return;
          const barBox = tabbar.getBoundingClientRect();
          const tabBox = tab.getBoundingClientRect();
          const m = { x0: tabBox.left - barBox.left - 10, x1: tabBox.right - barBox.left + 10 };
          setActive(half);
          gsap.set(pillRef.current, { willChange: "transform, width" });
          gsap.to(pillState.current, {
            x0: m.x0,
            x1: m.x1,
            duration: 0.5,
            ease: "back.out(1.5)",
            overwrite: "auto",
            onUpdate: () => {
              const w = root.querySelector<HTMLElement>(".tabs-wrap");
              const p = panelsRef.current;
              if (w && p) paint(tabbar, w, p, pillState.current);
            },
            onComplete: () => gsap.set(pillRef.current, { willChange: "auto" }),
          });
        }
      },
    });
    function onResize() {
      sizePanels();
    }
    let timer = 0;
    function debounced() {
      window.clearTimeout(timer);
      timer = window.setTimeout(onResize, 200);
    }
    function sizePanels() {
      const boxes = panelsEl.querySelectorAll<HTMLElement>(".tabpanel");
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      if (!desktop) {
        panelsEl.style.height = "";
        return;
      }
      const shown = Array.from(boxes).filter((p) => !p.hasAttribute("hidden"));
      shown.forEach((p) => p.removeAttribute("hidden"));
      const max = Math.max(...Array.from(boxes).map((p) => p.offsetHeight));
      panelsEl.style.height = `${max}px`;
      boxes.forEach((p, k) => {
        if (k !== activeRef.current) p.setAttribute("hidden", "");
      });
    }
    sizePanels();
    window.addEventListener("resize", debounced);
    document.fonts.ready.then(sizePanels);
    return () => {
      window.removeEventListener("resize", debounced);
      window.clearTimeout(timer);
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  function onKey(e: React.KeyboardEvent) {
    const order = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!order.includes(e.key)) return;
    e.preventDefault();
    let next = activeRef.current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (next + 1) % TABS.tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (next - 1 + TABS.tabs.length) % TABS.tabs.length;
    else if (e.key === "Home") next = 0;
    else next = TABS.tabs.length - 1;
    selectTab(next);
    tabbarRef.current?.querySelectorAll<HTMLElement>(".tab")[next]?.focus();
  }

  return (
    <section id="about-tabs" ref={rootRef} aria-label="Credentials and values" className="relative border-t border-line">
      <div className="tabs-wrap relative mx-auto w-[min(72rem,100%-2rem)] py-16 text-center lg:py-24">
        <h2 className="visually-hidden">Credentials and values</h2>
        <div
          ref={tabbarRef}
          role="tablist"
          aria-label="About Copperline"
          onKeyDown={onKey}
          className="tabbar relative inline-flex gap-1 rounded-full border border-line bg-surface p-1.5"
        >
          <span ref={pillRef} aria-hidden="true" className="tab-pill absolute top-1.5 bottom-1.5 left-0 w-0 rounded-full bg-accent" />
          {TABS.tabs.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-selected={active === i}
              aria-controls={`panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => selectTab(i)}
              className="tab rise relative z-[1] cursor-pointer rounded-full border-0 bg-transparent px-6 py-2.5 text-[0.95rem] font-bold whitespace-nowrap"
              style={{ color: active === i ? "var(--color-accent-ink)" : "var(--color-muted)" }}
            >
              {label}
            </button>
          ))}
        </div>
        <svg ref={svgRef} className="tab-neck pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="neckGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#acff46" stopOpacity="0.55" />
              <stop offset="1" stopColor="#acff46" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path ref={neckRef} className="tab-neck-path" d="" fill="url(#neckGrad)" />
        </svg>
        <div ref={panelsRef} className="tab-panels relative mt-14 text-left">
          {items.map((list, i) => (
            <div
              key={TABS.tabs[i]}
              role="tabpanel"
              id={`panel-${i}`}
              aria-labelledby={`tab-${i}`}
              tabIndex={0}
              hidden={active !== i}
              className="tabpanel rise md:motion-safe:absolute md:motion-safe:inset-x-0 md:motion-safe:top-0"
            >
              <ul className={i === 0 ? "grid list-none gap-4 p-0 sm:grid-cols-2" : "grid list-none gap-4 p-0"}>
                {list.map((item) => (
                  <li
                    key={item.title}
                    className={
                      i === 0
                        ? "rounded-2xl border border-line border-t-2 border-t-accent bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6"
                        : "rounded-2xl border border-line border-l-2 border-l-accent bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6"
                    }
                  >
                    <p className={i === 0 ? "font-mono text-lg font-bold" : "text-lg font-bold"}>{item.title}</p>
                    <p className="mt-1.5 text-sm text-muted">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
