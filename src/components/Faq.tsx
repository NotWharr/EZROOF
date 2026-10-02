import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FAQ, CONTACT } from "../content";
import { Reveal } from "./ui";

// FAQ accordion: one open at a time, Motion height animation.
export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" aria-label="Frequently asked questions" className="relative border-t border-line">
      <div className="mx-auto grid w-[min(72rem,100%-2rem)] grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:py-24">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-4xl font-bold tracking-tight">Questions, answered plainly.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Response times, warranties, trenchless options and pricing. Still unsure? Send one message and get a
            human reply.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold whitespace-nowrap text-accent-ink transition-all active:scale-[0.98]"
          >
            Get Free Estimate
          </a>
        </Reveal>
        <div className="lg:col-span-7">
          {FAQ.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold text-white transition-colors hover:text-accent"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <span aria-hidden="true" className="shrink-0 font-mono text-lg text-accent">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="pr-8 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                </motion.div>
              </div>
            );
          })}
          <p className="mt-6 text-sm text-muted">
            Prefer to talk? <a href={CONTACT.phoneHref} className="font-semibold text-paper hover:text-accent">{CONTACT.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
