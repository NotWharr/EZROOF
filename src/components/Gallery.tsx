import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenis } from "../hooks/useLenis";
import { GALLERY } from "../content";
import { MOTION } from "../lib/motion";
import { Reveal } from "./ui";

gsap.registerPlugin(ScrollTrigger);

function imgSrc(seed: string, w = 520, h = 680): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const LENS_MAX = 1.5;
const LENS_MAX_MOBILE = 1.25;
const LENS_RANGE = 1.2; // reach in card widths

// Pinned horizontal showcase: vertical scroll drives the rail sideways
// while the center card magnifies like a lens. Arrows, card clicks and
// keyboard glide cards to the middle by scrolling the pin.
export default function Gallery() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const geom = useRef({ step: 280, cardW: 260, minX: 0 });
  const api = useRef<{ goTo: (i: number) => number; centered: () => number } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reduceMotion) return;
    // Freeze the narrowed elements for every closure below.
    const rootEl: HTMLElement = root;
    const trackEl: HTMLDivElement = track;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".rail-card"));
    if (cards.length === 0) return;

    function measure() {
      const cardW = cards[0].offsetWidth;
      const step = cards[1].offsetLeft - cards[0].offsetLeft || cardW + 20;
      // End padding lets the first AND last card each reach center.
      const pad = rootEl.clientWidth / 2 - cardW / 2;
      trackEl.style.paddingInline = `${Math.max(pad, 0)}px`;
      geom.current = { step, cardW, minX: -((cards.length - 1) * step) };
      return geom.current;
    }

    // Per-card painters, created once. The ticker calls the lens every
    // frame instead of building tweens, which stays cheap for 8 cards.
    const setters = cards.map((card) => ({
      scale: gsap.quickSetter(card, "scale"),
      x: gsap.quickSetter(card, "x"),
      frame: card.querySelector<HTMLElement>(".rail-frame"),
    }));

    // Lens: distance from viewport center maps to scale with a power2
    // falloff; neighbors get shoved apart so nothing covers. Opacity
    // lives on the photo frame only, so captions always pass contrast.
    function paint() {
      const { cardW } = geom.current;
      const max = window.matchMedia("(max-width: 767px)").matches ? LENS_MAX_MOBILE : LENS_MAX;
      const cx = window.innerWidth / 2;
      const range = cardW * LENS_RANGE;
      let centerScale = 1;
      let best = 0;
      let bestDist = Infinity;
      const scales = cards.map((card) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - cx);
        const t = Math.min(dist / range, 1);
        const s = 1 + (max - 1) * (1 - t) * (1 - t);
        if (s > centerScale) centerScale = s;
        if (dist < bestDist) {
          bestDist = dist;
          best = cards.indexOf(card);
        }
        return { s, dist };
      });
      cards.forEach((card, i) => {
        const { s, dist } = scales[i];
        const t = Math.min(dist / range, 1);
        setters[i].scale(s);
        card.style.zIndex = String(1 + Math.round((s - 1) * 20));
        const r = card.getBoundingClientRect();
        const dir = r.left + r.width / 2 >= cx ? 1 : -1;
        const near = Math.max(0, 1 - dist / (cardW * 2.5));
        setters[i].x(dir * (centerScale - 1) * cardW * 0.35 * near);
        card.classList.toggle("is-focus", i === best);
        setters[i].frame?.style.setProperty("opacity", String(0.6 + 0.4 * (1 - t) * (1 - t)));
      });
      const x = Number(gsap.getProperty(track, "x"));
      const { minX } = geom.current;
      gsap.set(fillRef.current, { scaleX: minX === 0 ? 1 : gsap.utils.clamp(0, 1, x / minX) });
    }

    measure();
    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => measure().minX,
        ease: MOTION.EASE_NONE,
        scrollTrigger: {
          trigger: "#work",
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: MOTION.SCRUB,
          invalidateOnRefresh: true,
          onUpdate: paint,
          onToggle: (self) => gsap.set(track, { willChange: self.isActive ? "transform" : "auto" }),
        },
      },
    );
    // Gentle rise as the pin engages (y only: text never fades).
    gsap.fromTo(
      cards,
      { y: 60 },
      {
        y: 0,
        duration: 0.8,
        ease: MOTION.EASE_OUT,
        stagger: MOTION.RISE_STAGGER,
        scrollTrigger: { trigger: "#work", start: "top 75%", once: true },
      },
    );
    const tick = () => paint();
    gsap.ticker.add(tick);
    paint();

    function centered() {
      const x = Number(gsap.getProperty(track, "x"));
      return gsap.utils.clamp(0, cards.length - 1, Math.round(-x / geom.current.step));
    }
    function goTo(i: number) {
      const { step, minX } = geom.current;
      const clamped = gsap.utils.clamp(0, cards.length - 1, Math.round(i));
      const targetX = -clamped * step;
      const st = tween.scrollTrigger;
      if (!st) return clamped;
      const progress = minX === 0 ? 0 : targetX / minX;
      const y = st.start + progress * (st.end - st.start);
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo(0, y);
      return clamped;
    }
    api.current = { goTo, centered };

    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const card = (e.target as HTMLElement).closest?.(".rail-card");
      if (!card || !rootEl.contains(card)) return;
      e.preventDefault();
      const next = goTo(centered() + (e.key === "ArrowRight" ? 1 : -1));
      cards[next].focus({ preventScroll: true });
    }
    function onClick(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest?.(".rail-card");
      if (!card || !rootEl.contains(card)) return;
      const i = cards.indexOf(card as HTMLElement);
      if (i >= 0) goTo(i);
    }
    rootEl.addEventListener("keydown", onKey);
    rootEl.addEventListener("click", onClick);

    let timer = 0;
    function onResize() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        measure();
        ScrollTrigger.refresh();
      }, 200);
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
      rootEl.removeEventListener("keydown", onKey);
      rootEl.removeEventListener("click", onClick);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduceMotion, lenis]);

  function arrow(dir: 1 | -1) {
    const fns = api.current;
    if (fns) fns.goTo(fns.centered() + dir);
  }

  return (
    <section id="work" ref={rootRef} aria-label="Recent work gallery" className="relative overflow-hidden border-t border-line">
      <Reveal className="mx-auto flex w-[min(72rem,100%-2rem)] flex-wrap items-end justify-between gap-4 pt-16 pb-10 lg:pt-24">
        <div>
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-accent">{GALLERY.eyebrow}</p>
          <h2 className="font-display mt-4 max-w-[22ch] text-h2 font-bold leading-[1.05] tracking-tight">
            {GALLERY.title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => arrow(-1)}
            className="h-11 w-11 rounded-full border border-line text-lg transition-colors hover:border-accent"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => arrow(1)}
            className="h-11 w-11 rounded-full border border-line text-lg transition-colors hover:border-accent"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </Reveal>
      <div className="rail-viewport overflow-hidden py-[70px]" role="region" aria-label="Work showcase photos">
        <div ref={trackRef} className="rail-track flex w-max items-center gap-5">
          {GALLERY.items.map((item) => (
            <figure
              key={item.seed}
              tabIndex={0}
              aria-label={`${item.job}, ${item.location}`}
              className="rail-card m-0 w-[260px] flex-none outline-none focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-md:w-[200px]"
            >
              <span className="rail-frame block h-[340px] overflow-hidden rounded-2xl border border-line bg-surface transition-colors max-md:h-[280px]">
                <img
                  src={imgSrc(item.seed)}
                  alt=""
                  width={520}
                  height={680}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "260 / 340" }}
                />
              </span>
              <figcaption className="mt-3 text-center text-sm text-muted">
                {item.job} - {item.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mx-auto w-[min(72rem,100%-2rem)] pt-2 pb-16 lg:pb-24">
        <div className="rail-progress h-[2px] rounded bg-white/[0.08]" aria-hidden="true">
          <span ref={fillRef} className="rail-progress-fill block h-full origin-left scale-x-0 rounded bg-accent" />
        </div>
      </div>
    </section>
  );
}
