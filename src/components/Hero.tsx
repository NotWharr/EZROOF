import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { HERO } from "../content";
import { MaskedLines } from "./ui";
import heroBg from "../assets/hero-bg.webp";
import heroBg768 from "../assets/hero-bg-768.webp";
import heroBg1280 from "../assets/hero-bg-1280.webp";

gsap.registerPlugin(ScrollTrigger);

// Split hero: copy left, photo right. Masked headline reveal once
// the intro lands; photo drifts against the cursor + settles on scroll.
export default function Hero({ started }: { started: boolean }) {
  const reduceMotion = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const show = started || reduceMotion;

  // Mouse parallax on the wrapper (quickTo, eased, fine pointers only).
  useEffect(() => {
    if (reduceMotion || !photoRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(photoRef.current, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(photoRef.current, "y", { duration: 0.7, ease: "power3" });
    function onMove(e: MouseEvent) {
      gsap.set(photoRef.current, { willChange: "transform" });
      xTo(-(e.clientX / window.innerWidth - 0.5) * 20);
      yTo(-(e.clientY / window.innerHeight - 0.5) * 20);
    }
    let idle = 0;
    function onMoveIdle(e: MouseEvent) {
      onMove(e);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => gsap.set(photoRef.current, { willChange: "auto" }), 1500);
    }
    window.addEventListener("mousemove", onMoveIdle);
    return () => {
      window.removeEventListener("mousemove", onMoveIdle);
      window.clearTimeout(idle);
    };
  }, [reduceMotion]);

  // Scroll zoom-out + lag on the img itself (separate layer, no fight).
  useEffect(() => {
    if (reduceMotion || !imgRef.current) return;
    const tween = gsap.fromTo(
      imgRef.current,
      { scale: 1.1, yPercent: 0 },
      {
        scale: 1,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
          onToggle: (self) =>
            gsap.set(imgRef.current, { willChange: self.isActive ? "transform" : "auto" }),
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduceMotion]);

  const titleLines = HERO.title.split(". ").map((s) => (s.endsWith(".") ? s : `${s}.`));

  return (
    <section className="hero relative flex min-h-svh items-center overflow-hidden pt-20">
      <div className="hero-visual pointer-events-none absolute inset-0" aria-hidden="true">
        <div ref={photoRef} className="absolute -inset-[6%]">
          <img
            ref={imgRef}
            src={heroBg1280}
            srcSet={`${heroBg768} 768w, ${heroBg1280} 1280w, ${heroBg} 1672w`}
            sizes="100vw"
            width={1280}
            height={720}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute"
          style={{
            width: "60vmax",
            height: "60vmax",
            right: "-20vmax",
            top: "-20vmax",
            background: "radial-gradient(circle, rgb(172 255 70 / 0.14), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            opacity: 0.35,
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.25) 45%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 70% 20%, rgb(172 255 70 / 0.10), transparent 70%), radial-gradient(ellipse 120% 100% at 50% 45%, transparent 55%, rgb(9 9 11 / 0.88))",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <motion.div
              initial={show ? { opacity: 0 } : false}
              animate={show ? { opacity: 1 } : undefined}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-micro uppercase tracking-[0.18em] text-accent">{HERO.eyebrow}</p>
              <h1 className="font-display mt-4 max-w-[16ch] text-h1 font-bold leading-[1.02] tracking-tighter">
                {show ? <MaskedLines lines={titleLines} /> : HERO.title}
              </h1>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted">{HERO.sub}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold whitespace-nowrap text-accent-ink transition-all active:scale-[0.98]"
                >
                  {HERO.primary} <span aria-hidden="true">→</span>
                </a>
                <a
                  href="tel:+15550147663"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-zinc-400 active:scale-[0.98]"
                >
                  {HERO.secondary}
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {HERO.ticks.map((tick) => (
                  <li key={tick}>{tick}</li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="w-full lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <img
                src={heroBg1280}
                srcSet={`${heroBg768} 768w, ${heroBg1280} 1280w, ${heroBg} 1672w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={1280}
                height={720}
                alt="Copper supply lines with brass fittings"
                loading="lazy"
                className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[460px]"
              />
            </div>
            <p className="mt-3 text-sm text-zinc-500">Copper supply lines with brass fittings, on site.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
