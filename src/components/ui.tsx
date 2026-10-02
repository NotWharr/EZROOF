import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { MOTION } from "../lib/motion";

// Fade-up on scroll into view. One shared shape for every reveal.
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ y: MOTION.RISE_Y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: MOTION.RISE_DURATION, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Masked line reveals for display headlines: each line slides up
// from inside its overflow-hidden mask, staggered.
export function MaskedLines({ lines, className }: { lines: readonly string[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} style={{ display: "block" }}>
      {lines.map((line, i) => (
        <span key={line} className="mask" style={{ display: "block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "block" }}
            initial={reduce ? false : { y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: reduce ? 0 : i * MOTION.RISE_STAGGER }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Eyebrow + headline block shared by every section header.
export function SectionHead({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? (
        <p
          className="font-mono uppercase"
          style={{ fontSize: "var(--text-micro)", letterSpacing: "0.18em", color: "var(--color-accent)" }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="font-display text-h2 font-bold"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
      >
        {title}
      </h2>
    </div>
  );
}

// Magnetic anchor: drifts toward the cursor with springs, snaps back
// on leave. Motion values keep it off the React render cycle.
export function MagneticLink({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((e.clientX - (box.left + box.width / 2)) * 0.25);
    y.set((e.clientY - (box.top + box.height / 2)) * 0.25);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={
        primary
          ? "inline-flex items-center justify-center gap-2 rounded-xl bg-accent font-bold text-accent-ink"
          : "inline-flex items-center justify-center gap-2 rounded-xl border border-line font-semibold text-paper"
      }
    >
      {children}
    </motion.a>
  );
}
