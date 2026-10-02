import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenis } from "../hooks/useLenis";
import { PROMISE } from "../content";
import { MOTION } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Pinned modal moment (scrubbed) doubling as a real accessible modal.
// Absolute/fixed choreography only applies at md+ WITH motion allowed;
// otherwise everything is static and visible, and the tile scrolls to it.
export default function Dialog() {
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const lastFocused = useRef<Element | null>(null);

  // Scrubbed pinned sequence (desktop with motion only).
  useEffect(() => {
    const root = rootRef.current;
    const dialog = dialogRef.current;
    if (!root || !dialog || reduceMotion) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("#about-dialog .rise").forEach((el) => {
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
    gsap.set(dialog, { xPercent: -50, yPercent: -50 });
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, // element ref: context scoping would hide our own id
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: MOTION.SCRUB,
          onToggle: (self) => gsap.set(dialog, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });
      tl.fromTo(
        root.querySelector(".dlg-overlay"),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: MOTION.EASE_NONE },
      )
        .fromTo(
          dialog,
          { y: 60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.4, ease: MOTION.EASE_SNAP },
          "-=0.15",
        )
        .fromTo(
          root.querySelector(".dlg-trail"),
          { y: 140, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: MOTION.EASE_NONE },
          "-=0.3",
        )
        .fromTo(
          root.querySelectorAll(".dlg-piece"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: MOTION.EASE_NONE },
          "-=0.3",
        )
        .to({}, { duration: 0.5 })
        .to(dialog, { y: -30, autoAlpha: 0, duration: 0.4, ease: MOTION.EASE_NONE })
        .to(root.querySelector(".dlg-overlay"), { opacity: 0, duration: 0.4, ease: MOTION.EASE_NONE }, "-=0.25");
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  // Unscrubbed modal open/close with focus trap + Escape + return.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      // Closing: fade out, then hide and hand everything back.
      if (dialog.getAttribute("aria-hidden") === "false") {
        const finish = () => {
          dialog.setAttribute("aria-hidden", "true");
          lenis?.start();
          if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus({ preventScroll: true });
        };
        if (reduceMotion) {
          gsap.set(dialog, { autoAlpha: 0, y: 30 });
          finish();
        } else {
          gsap.to(dialog, {
            autoAlpha: 0,
            y: 30,
            duration: 0.25,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: finish,
          });
        }
      }
      return;
    }
    lastFocused.current = document.activeElement;
    dialog.setAttribute("aria-hidden", "false");
    lenis?.stop();
    gsap.fromTo(
      dialog,
      { y: 60, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: reduceMotion ? 0 : 0.4,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => closeRef.current?.focus({ preventScroll: true }),
      },
    );
    gsap.fromTo(
      dialog.querySelectorAll(".dlg-piece"),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: reduceMotion ? 0 : 0.35,
        stagger: reduceMotion ? 0 : 0.08,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(
        dialog!.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, lenis, reduceMotion]);

  function onTileClick() {
    // Stacked layouts show the panel in flow: scroll to it instead.
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (lenis) lenis.scrollTo(dialog, { offset: -80 });
      else dialog.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setOpen(true);
  }

  return (
    <section
      id="about-dialog"
      ref={rootRef}
      aria-label="Our promise"
      className="relative border-t border-line"
    >
      <div className="dlg-pin relative flex min-h-svh items-center justify-center">
        <div className="mx-auto w-[min(72rem,100%-2rem)] text-center">
          <button
            type="button"
            className="rise w-[min(36rem,100%)] rounded-2xl border border-line border-t-2 border-t-accent bg-gradient-to-b from-white/[0.05] to-white/[0.01] px-6 py-10 font-[inherit] text-paper transition-colors hover:border-accent active:scale-[0.98] sm:px-12 sm:py-16"
            aria-haspopup="dialog"
            onClick={onTileClick}
          >
            <span className="block text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-tight">
              {PROMISE.tileTitle}
            </span>
            <span className="mt-3 block font-mono text-micro uppercase tracking-[0.18em] text-accent">
              {PROMISE.tileHint}
            </span>
          </button>
        </div>
        <div className="dlg-overlay absolute inset-0 z-[2] hidden bg-black/60 opacity-0 md:motion-safe:block" aria-hidden="true" />
        <div
          className="dlg-trail pointer-events-none absolute top-1/2 z-[3] hidden h-[40vh] w-[min(560px,92vw)] opacity-0 md:motion-safe:block"
          style={{
            left: 0,
            right: 0,
            margin: "-20vh auto 0",
            background: "linear-gradient(to top, rgb(172 255 70 / 0.16), transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dlgTitle"
          aria-hidden="true"
          className="dlg z-[4] mt-6 rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-surface-3 p-8 text-left sm:p-12 md:motion-safe:absolute md:motion-safe:top-1/2 md:motion-safe:left-1/2 md:motion-safe:m-0 md:motion-safe:h-[80svh] md:motion-safe:w-[min(520px,calc(100%-2rem))] md:motion-safe:overflow-y-auto"
        >
          <button
            ref={closeRef}
            type="button"
            aria-label={PROMISE.closeLabel}
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 hidden h-11 w-11 items-center justify-center rounded-full border border-line text-xl text-muted hover:border-muted hover:text-paper md:motion-safe:flex"
          >
            <span aria-hidden="true">×</span>
          </button>
          <h2 id="dlgTitle" className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-tight">
            {PROMISE.dialogTitle}
          </h2>
          <ul className="mt-5 grid list-none gap-3 p-0">
            {PROMISE.bullets.map((bullet) => (
              <li key={bullet} className="dlg-piece relative pl-6 text-muted">
                <span aria-hidden="true" className="absolute top-[0.55em] left-0 h-[2px] w-2.5 bg-accent" />
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href={PROMISE.buttonHref}
            className="dlg-piece mt-7 inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-sm font-bold whitespace-nowrap text-accent-ink transition-all active:scale-[0.98]"
          >
            {PROMISE.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
