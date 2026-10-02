import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { PROCESS } from "../content";
import { MOTION } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Pinned process timeline: Diagnose, Fix, Backed light up in order
// as scroll scrubs through, with a progress hairline.
export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("#process .rise").forEach((el) => {
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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, // element ref: context scoping would hide our own id
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: MOTION.SCRUB,
        },
      });
      tl.fromTo(
        ".process-step",
        { y: 40, opacity: 0.25 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.6, ease: MOTION.EASE_NONE },
      )
        .fromTo(
          ".process-bar-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.8, ease: MOTION.EASE_NONE },
          0,
        )
        .to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section id="process" ref={rootRef} aria-label="How we work" className="relative border-t border-line">
      <div className="mx-auto w-[min(72rem,100%-2rem)] py-16 lg:py-24">
        <p className="rise font-mono text-micro uppercase tracking-[0.18em] text-accent">{PROCESS.eyebrow}</p>
        <h2 className="rise mt-4 max-w-[22ch] font-display text-h2 font-bold leading-[1.05] tracking-tight">
          {PROCESS.title}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PROCESS.steps.map((step) => (
            <div key={step.title} className="process-step rise border-t-2 border-accent pt-5">
              <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 h-[2px] rounded bg-white/[0.08]" aria-hidden="true">
          <span className="process-bar-fill block h-full origin-left scale-x-0 rounded bg-accent" />
        </div>
      </div>
    </section>
  );
}
