import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { BASICS } from "../content";
import { MOTION } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const SPOTS = [
  { left: "14%", top: "24%" },
  { left: "86%", top: "30%" },
  { left: "20%", top: "74%" },
  { left: "80%", top: "70%" },
] as const;

// Pinned chapter: facts float in scattered, converge and merge into
// the title, the title docks left, details stack right. Scrubbed.
// Base CSS is the stacked mobile/reduced layout; the absolute
// scrub layout only applies at md+ WITH motion allowed.
export default function Basics() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const title = root.querySelector<HTMLElement>(".bb-title");
    const slot = root.querySelector<HTMLElement>(".bb-slot");
    const facts = gsap.utils.toArray<HTMLElement>(".bb-fact");
    const details = gsap.utils.toArray<HTMLElement>(".bb-detail");
    if (!title || !slot || facts.length === 0) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        gsap.utils
          .toArray<HTMLElement>(".bb-fact, .bb-title, .bb-detail")
          .forEach((el) => {
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
        return;
      }

      gsap.set(facts, { xPercent: -50, yPercent: -50 });
      gsap.set(title, { xPercent: -50, yPercent: -50 });

      const centerOf = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, // element ref: context scoping would hide our own id
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: MOTION.SCRUB,
          onToggle: (self) =>
            gsap.set([title, ...facts], { willChange: self.isActive ? "transform" : "auto" }),
        },
      });
      tl.fromTo(
        facts,
        { y: MOTION.RISE_Y, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.4, ease: MOTION.EASE_NONE },
      )
        .to({}, { duration: 0.4 })
        .to(
          facts,
          {
            x: (_i: number, el: Element) => {
              const stage = root.getBoundingClientRect();
              return stage.left + stage.width / 2 - centerOf(el).x;
            },
            y: (_i: number, el: Element) => {
              const stage = root.getBoundingClientRect();
              return stage.top + stage.height / 2 - centerOf(el).y;
            },
            scale: 1.08,
            duration: 0.8,
            ease: MOTION.EASE_NONE,
          },
          ">-0.1",
        )
        .to(facts, { opacity: 0, filter: "blur(10px)", duration: 0.5, ease: MOTION.EASE_NONE }, "-=0.3")
        .fromTo(
          title,
          { opacity: 0, scale: 0.85, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: MOTION.EASE_NONE },
          "-=0.5",
        )
        .to(
          title,
          {
            x: () => {
              const s = slot.getBoundingClientRect();
              return s.left + s.width / 2 - centerOf(title).x;
            },
            y: () => {
              const s = slot.getBoundingClientRect();
              return s.top + s.height / 2 - centerOf(title).y;
            },
            scale: () => slot.getBoundingClientRect().width / title.getBoundingClientRect().width,
            duration: 0.9,
            ease: MOTION.EASE_NONE,
          },
          ">-0.1",
        )
        .fromTo(
          details,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: MOTION.EASE_NONE },
          "-=0.55",
        )
        .to({}, { duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      id="about-basics"
      ref={rootRef}
      aria-label="About Copperline"
      className="about-stage relative border-t border-line md:motion-safe:min-h-svh md:motion-safe:overflow-hidden"
    >
      <div className="bb-scatter mx-auto grid w-[min(72rem,100%-2rem)] gap-4 pt-16 md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:m-0 md:motion-safe:block md:motion-safe:w-auto md:motion-safe:p-0">
        {BASICS.facts.map((fact, i) => (
          <div
            key={fact.label}
            className="bb-fact rounded-2xl border border-line border-l-2 border-l-accent bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 md:motion-safe:absolute md:motion-safe:w-[230px]"
            style={{ left: SPOTS[i % SPOTS.length].left, top: SPOTS[i % SPOTS.length].top }}
          >
            <p className="font-mono text-3xl font-bold">{fact.value}</p>
            <p className="mt-1 text-sm text-muted">{fact.label}</p>
          </div>
        ))}
      </div>
      <h2 className="bb-title mx-auto w-[min(72rem,100%-2rem)] py-12 text-center text-[clamp(2.5rem,10vw,3.5rem)] font-extrabold leading-none tracking-tighter md:motion-safe:absolute md:motion-safe:left-1/2 md:motion-safe:top-[44%] md:motion-safe:z-[2] md:motion-safe:m-0 md:motion-safe:w-auto md:motion-safe:p-0 md:motion-safe:text-[clamp(3rem,8vw,7rem)]">
        {BASICS.title}
      </h2>
      <div className="bb-panel mx-auto block w-[min(72rem,100%-2rem)] pb-16 md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:grid md:motion-safe:grid-cols-12 md:motion-safe:content-center md:motion-safe:gap-6 md:motion-safe:p-0">
        <div className="bb-slot hidden min-h-[40vh] md:motion-safe:col-span-4 md:motion-safe:block" aria-hidden="true" />
        <div className="bb-details grid gap-4 md:motion-safe:col-span-7 md:motion-safe:col-start-6">
          {BASICS.details.map((item) => (
            <div
              key={item.no}
              className="bb-detail grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 rounded-2xl border border-line border-t-2 border-t-accent bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
            >
              <p className="font-mono font-bold text-accent">{item.no}</p>
              <p className="text-lg font-bold tracking-tight">{item.label}</p>
              <p className="col-start-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
