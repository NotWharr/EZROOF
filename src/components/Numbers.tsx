import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, useInView, useReducedMotion } from "motion/react";
import { NUMBERS } from "../content";

gsap.registerPlugin(ScrollTrigger);

function format(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function Stat({ stat }: { stat: (typeof NUMBERS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const numRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // Count-up once: Motion animates a plain object, painted onUpdate.
  useEffect(() => {
    if (!inView || !numRef.current) return;
    const target = `${stat.prefix}${format(stat.value, stat.decimals)}${stat.suffix}`;
    if (reduceMotion) {
      numRef.current.textContent = target;
      if (barRef.current) gsap.set(barRef.current, { scaleX: 1 });
      return;
    }
    const counter = { v: 0 };
    const controls = animate(counter, { v: stat.value }, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${stat.prefix}${format(counter.v, stat.decimals)}${stat.suffix}`;
        }
      },
    });
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power3.out", delay: 0.9 },
      );
    }
    return () => controls.stop();
  }, [inView, reduceMotion, stat]);

  return (
    <div ref={ref} className="rise">
      <p
        ref={numRef}
        className="font-mono text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight tabular-nums"
      >
        {`${stat.prefix}${format(0, stat.decimals)}${stat.suffix}`}
      </p>
      <span ref={barRef} aria-hidden="true" className="mt-2 block h-[2px] w-12 origin-left scale-x-0 bg-accent" />
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </div>
  );
}

export default function Numbers() {
  return (
    <section aria-label="Copperline in numbers" className="relative border-t border-line">
      <h2 className="visually-hidden">Copperline in numbers</h2>
      <div className="mx-auto grid w-[min(72rem,100%-2rem)] grid-cols-2 gap-x-8 gap-y-10 py-16 md:grid-cols-4 lg:py-24">
        {NUMBERS.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
