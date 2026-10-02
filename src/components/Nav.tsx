import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { BRAND, CONTACT } from "../content";

gsap.registerPlugin(ScrollTrigger);

const LEFT_LINKS = [{ label: "Work", href: "#work" }];
const RIGHT_LINKS = [{ label: "Reviews", href: "#reviews" }];
const MOBILE_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
];

// Fixed nav: centered logo slot (the intro wordmark lands on it),
// links left and right, phone + CTA, mobile menu, progress bar below.
export default function Nav({ started }: { started: boolean }) {
  const [open, setOpen] = useState(false);
  const fillRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const visible = started || reduceMotion;

  // Thin progress fill driven by total page scroll. Transform only.
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    const tween = gsap.to(fill, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: reduceMotion ? true : 0.3,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduceMotion]);

  return (
    <>
      <header
        id="nav"
        className="fixed inset-x-0 top-0 z-[var(--z-nav)] grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line bg-ink/95 px-4 backdrop-blur-md sm:px-6 lg:px-8"
      >
        <nav
          className="hidden items-center gap-7 transition-opacity duration-500 lg:flex"
          style={{ opacity: visible ? 1 : 0 }}
          aria-label="Primary left"
        >
          {LEFT_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-muted hover:text-paper">
              {link.label}
            </a>
          ))}
        </nav>

        {reduceMotion ? (
          <a
            href="#top"
            aria-label="Copperline home"
            className="justify-self-center text-lg font-bold uppercase tracking-tight text-white"
          >
            {BRAND.first}
            <span className="text-accent">{BRAND.second}</span>
          </a>
        ) : (
          <div className="nav-logo-slot justify-self-center text-lg font-bold uppercase" aria-hidden="true">
            <span className="invisible">Copperline</span>
          </div>
        )}

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <nav
            className="flex items-center gap-7 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0 }}
            aria-label="Primary right"
          >
            {RIGHT_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-semibold text-muted hover:text-paper">
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-200 transition-opacity duration-500 hover:text-white"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <span aria-hidden="true" className="font-bold text-accent">✆</span>
            {CONTACT.phone}
          </a>
          <a
            href="#contact"
            className="whitespace-nowrap rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-all active:scale-[0.98]"
          >
            Get Free Estimate
          </a>
        </div>

        <div className="col-start-3 flex items-center justify-end gap-2 lg:hidden">
          <a
            href="#contact"
            className="whitespace-nowrap rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-all active:scale-[0.98]"
          >
            Get Free Estimate
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-zinc-200 hover:border-accent hover:text-white"
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>

        {open ? (
          <nav className="col-span-3 border-t border-line bg-ink px-4 py-4 lg:hidden" aria-label="Mobile">
            <ul className="space-y-1">
              {MOBILE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-zinc-200 hover:bg-surface hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-200 hover:bg-surface hover:text-white"
                >
                  Call {CONTACT.phone}
                </a>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <div
        className="scroll-progress fixed right-0 left-0"
        role="progressbar"
        aria-hidden="true"
        style={{
          top: "4rem",
          zIndex: 39,
          height: 3,
          background: "rgb(255 255 255 / 0.08)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <span
          ref={fillRef}
          className="block h-full"
          style={{
            background: "var(--color-accent)",
            boxShadow: "var(--shadow-glow)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>
    </>
  );
}
