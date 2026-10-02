import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { OWNER } from "../content";
import { MOTION } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Pinned headline: photo slot opens 0 to full, shoving the words
// apart, photo settles from a zoom, bio + quote rise from masks.
export default function Owner() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const slot = root.querySelector<HTMLElement>(".ow-slot");
    const photo = root.querySelector<HTMLElement>(".ow-photo");
    if (!slot || !photo) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        gsap.utils.toArray<HTMLElement>("#about-owner .rise").forEach((el) => {
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, // element ref: context scoping would hide our own id
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: MOTION.SCRUB,
          onToggle: (self) => gsap.set(photo, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });
      tl.fromTo(
        slot,
        { width: 0, height: 0 },
        { width: "34vw", height: "50vh", duration: 1, ease: MOTION.EASE_NONE },
      )
        .fromTo(photo, { scale: 1.3 }, { scale: 1, duration: 0.8, ease: MOTION.EASE_NONE }, "-=0.7")
        .fromTo(
          ".ow-line",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, stagger: 0.12, ease: MOTION.EASE_NONE },
          "-=0.3",
        )
        .fromTo(".ow-attr", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: MOTION.EASE_NONE }, "-=0.2")
        .to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section id="about-owner" ref={rootRef} aria-label="About the owner" className="relative border-t border-line">
      <div className="mx-auto w-[min(72rem,100%-2rem)] py-16 text-center lg:py-24">
        <h2 className="ow-headline font-extrabold leading-[1.05] tracking-tighter text-[clamp(2.5rem,9vw,4rem)] md:flex md:items-center md:justify-center md:gap-[2vw] md:whitespace-nowrap md:text-[clamp(2rem,4.5vw,4.5rem)]">
          <span className="ow-lead md:flex-none">{OWNER.lead}</span>
          <span className="ow-slot mx-auto my-6 block h-[38vh] w-full overflow-hidden rounded-2xl bg-surface md:m-0 md:h-[50vh] md:w-0 md:flex-none">
            <img
              className="ow-photo h-full w-full object-cover"
              src={OWNER.img}
              alt={OWNER.imgAlt}
              width={800}
              height={1000}
              loading="lazy"
            />
          </span>
          <span className="ow-tail md:flex-none">{OWNER.tail}</span>
        </h2>
        <div className="ow-bio mx-auto mt-8 max-w-[56ch] text-[1.05rem] text-muted">
          {OWNER.bio.map((line) => (
            <span key={line} className="mask rise block overflow-hidden">
              <span className="mask-inner ow-line block">{line}</span>
            </span>
          ))}
        </div>
        <blockquote className="ow-quote mx-auto mt-6 text-[clamp(1.3rem,3vw,1.75rem)] font-bold tracking-tight">
          {OWNER.quote.split(", ").map((line) => (
            <span key={line} className="mask rise block overflow-hidden">
              <span className="mask-inner ow-line block">{line}</span>
            </span>
          ))}
          <footer className="ow-attr rise mt-3 text-sm font-normal text-muted">{OWNER.attribution}</footer>
        </blockquote>
      </div>
    </section>
  );
}
