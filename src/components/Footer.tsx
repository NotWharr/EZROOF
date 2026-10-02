import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { BRAND, CONTACT, CTA, FOOTER } from "../content";
import { Reveal } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: "Copperline on X",
    href: "https://x.com",
    path: "M4 4l7.2 9.3L4.4 20h2.5l5.4-5.6 4.3 5.6H20l-7.5-9.7L19.4 4h-2.5l-4.9 5.1L8 4H4z",
  },
  {
    label: "Copperline on Instagram",
    href: "https://instagram.com",
    path: "M12 8.8A3.2 3.2 0 1012 15.2 3.2 3.2 0 0012 8.8zm0-2.1a5.3 5.3 0 110 10.6 5.3 5.3 0 010-10.6zm6.8-.3a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zM12 4.2c2.5 0 2.8 0 3.8.1 2.7.1 3.9 1.4 4 4 .1 1 .1 1.2.1 3.7s0 2.8-.1 3.8c-.1 2.7-1.4 3.9-4 4-1 .1-1.2.1-3.8.1s-2.8 0-3.8-.1c-2.7-.1-3.9-1.4-4-4C5 15 5 14.7 5 12s0-2.8.1-3.8c.1-2.7 1.4-3.9 4-4C10.2 4.2 10.4 4.2 12 4.2z",
  },
  {
    label: "Copperline on Facebook",
    href: "https://facebook.com",
    path: "M13.5 20v-7h2.4l.4-3h-2.8V8.1c0-.9.3-1.5 1.6-1.5h1.3V3.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V10H8.5v3H11v7h2.5z",
  },
  {
    label: "Copperline on LinkedIn",
    href: "https://linkedin.com",
    path: "M6.9 8.6H4V20h2.9V8.6zM5.4 7.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM10 20v-6c0-1.5.7-2.6 2.2-2.6 1.4 0 2 1 2 2.6v6h2.9v-6.4c0-2.9-1.5-4.4-3.9-4.4-1.5 0-2.5.8-3 1.7V8.6H7.3c0 .8 0 11.4 0 11.4H10z",
  },
] as const;

// Closing CTA band plus the curtain footer: main slides over it,
// unveiling brand, link columns and the legal bar at the very bottom.
export default function Footer() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".site-footer .foot-block",
        { opacity: 0, y: -8, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".site-footer", start: "top 92%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <>
      <section id="contact" aria-label="Get a free estimate" className="relative border-t border-line">
        <div className="mx-auto w-[min(72rem,100%-2rem)] py-16 lg:py-20">
          <Reveal className="rounded-2xl border border-line bg-surface px-6 py-12 text-center sm:px-12">
            <h2 className="font-display text-4xl font-bold tracking-tight">{CTA.title}</h2>
            <p className="mx-auto mt-3 max-w-[55ch] text-sm leading-relaxed text-muted sm:text-base">{CTA.body}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold whitespace-nowrap text-accent-ink transition-all active:scale-[0.98]"
              >
                Get Free Estimate
              </a>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold whitespace-nowrap text-white transition-all hover:border-zinc-400 active:scale-[0.98]"
              >
                <span aria-hidden="true" className="font-bold text-accent">✆</span>
                {CONTACT.phone}
              </a>
            </div>
          </Reveal>
          <div className="mt-12 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-zinc-500 sm:flex-row">
            <p>© 2026 Copperline Plumbing. Licensed, bonded and insured.</p>
            <p>Mon-Fri 7AM-6PM, Sat 8AM-2PM.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer relative z-[1] h-[720px] border-t border-line" style={{ clipPath: "inset(0)" }}>
        <div className="fixed bottom-0 left-0 h-[720px] w-full overflow-x-clip overflow-y-auto bg-ink">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 40% 30% at 20% 20%, rgb(172 255 70 / 0.07), transparent 70%), radial-gradient(ellipse 35% 30% at 80% 75%, rgb(172 255 70 / 0.05), transparent 70%)",
              }}
            />
          </div>
          <div className="relative mx-auto flex min-h-full w-[min(72rem,100%-2rem)] flex-col justify-center px-0 py-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="foot-block md:col-span-4">
                <p className="text-3xl font-bold tracking-tight uppercase">
                  {BRAND.first}
                  <span className="text-accent">{BRAND.second}</span>
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{FOOTER.tagline}</p>
                <div className="mt-6 flex gap-2.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.1rem] w-[1.1rem] fill-current">
                        <path d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8" aria-label="Footer">
                {FOOTER.columns.map((col) => (
                  <div key={col.heading} className="foot-block min-w-0">
                    <h3 className="text-micro font-bold uppercase tracking-[0.18em]">{col.heading}</h3>
                    <ul className="mt-4 grid gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href} className="text-sm break-words text-muted transition-colors hover:text-white">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
            <div className="foot-block mt-12 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-zinc-500 sm:flex-row">
              <p>{FOOTER.legal}</p>
              <p>{FOOTER.credit}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
