import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLenis } from "../hooks/useLenis";
import { BRAND } from "../content";

// Cinematic opening: "Copper" fades in, "line" wipes green behind its
// mask then pushes in, the curtain lifts while the SAME wordmark
// element flies and shrinks onto the nav slot. Runs once on load.
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLAnchorElement>(null);
  const lenis = useLenis();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;
    const slot = document.querySelector(".nav-logo-slot");
    const first = word.querySelector(".wm-first");
    const mask = word.querySelector(".wm-mask");
    const second = word.querySelector(".wm-second");
    if (!slot || !first || !mask || !second) {
      doneRef.current();
      return;
    }

    document.documentElement.classList.add("js-anim");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Curtain goes away; the parked wordmark stays put as the
          // nav logo (same element, fixed layer, still mounted).
          const curtain = root.querySelector<HTMLElement>(".preloader-curtain");
          if (curtain) curtain.style.display = "none";
          lenis?.start();
          doneRef.current();
        },
      });

      // Phase 1: first half only.
      tl.fromTo(first, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
        .to({}, { duration: 0.5 });

      // Phase 2: green wipe (still clipped), then the masked push-in.
      tl.to(second, { backgroundPosition: "0% 0", duration: 0.6, ease: "power3.inOut" })
        .to(
          mask,
          { clipPath: "inset(0 0 0 0%)", duration: 1, ease: "power4.inOut" },
          "-=0.1",
        )
        .fromTo(second, { x: 90 }, { x: 0, duration: 1, ease: "power4.inOut" }, "<")
        .to({}, { duration: 0.4 });

      // Phase 3: curtain lifts, wordmark flies to the measured slot.
      tl.add("curtain");
      tl.to(
        word,
        {
          x: () => {
            const from = word.getBoundingClientRect();
            const to = slot.getBoundingClientRect();
            return to.left + to.width / 2 - (from.left + from.width / 2);
          },
          y: () => {
            const from = word.getBoundingClientRect();
            const to = slot.getBoundingClientRect();
            return to.top + to.height / 2 - (from.top + from.height / 2);
          },
          scale: () => slot.getBoundingClientRect().width / word.getBoundingClientRect().width,
          transformOrigin: "center",
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: () => {
            word.classList.add("landed", "is-solid");
            word.removeAttribute("tabindex");
          },
        },
        "curtain",
      );
      tl.to(
        root.querySelector(".preloader-curtain"),
        { yPercent: -100, duration: 1.2, ease: "expo.inOut" },
        "curtain",
      );
    }, root);
    return () => ctx.revert();
  }, [lenis]);

  return (
    <div ref={rootRef} aria-hidden="true">
      {/* Fixed layer above overlay + nav; the curtain lifts beneath it. */}
      <div
        style={{
          display: "flex",
          position: "fixed",
          inset: 0,
          zIndex: 60,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <a
          ref={wordRef}
          id="wordmark"
          href="#top"
          aria-label="Copperline home"
          tabIndex={-1}
          className="wordmark"
          style={{
            fontSize: "clamp(3rem, 13vw, 11rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: "var(--color-paper)",
            textDecoration: "none",
            transformOrigin: "center",
          }}
        >
          <span className="wm-first">{BRAND.first}</span>
          <span
            className="wm-mask"
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", clipPath: "inset(0 0 0 100%)" }}
          >
            <span
              className="wm-second"
              style={{
                background: "linear-gradient(90deg, var(--color-accent) 50%, var(--color-paper) 50%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "100% 0",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {BRAND.second}
            </span>
          </span>
        </a>
      </div>
      <div
        className="preloader-curtain"
        style={{ position: "fixed", inset: 0, zIndex: 50, background: "var(--color-ink)" }}
      />
    </div>
  );
}
