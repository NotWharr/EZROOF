"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How fast can you get a plumber to my door?",
    answer:
      "Emergency calls get a 90 minute response window. Standard repairs and installs book within 48 hours across all six districts.",
  },
  {
    question: "Are your plumbers licensed and insured?",
    answer:
      "Yes. Every job is run by licensed, bonded and insured plumbers, with permits pulled where the city requires them.",
  },
  {
    question: "Can you replace a sewer line without digging up my yard?",
    answer:
      "In most cases, yes. We camera inspect first, then reline or burst the pipe trenchless wherever the line allows it.",
  },
  {
    question: "Tank or tankless water heater, which fits my home?",
    answer:
      "Tanks cost less upfront and suit steady use. Tankless fits tight spaces and endless back to back showers. We size both free.",
  },
  {
    question: "Do I pay more than the quote if the job runs long?",
    answer:
      "No. You approve a flat written price before we start. If we underestimated, that difference is on us.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
            Questions, answered plainly.
          </h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
            Response times, licensing, trenchless sewer options, heater sizing
            and flat pricing.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Get Free Estimate
          </Link>
        </div>

        <div className="lg:col-span-7">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center gap-4 py-5 text-left font-bold text-white hover:text-[#acff46] transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <span className="font-mono text-xl text-[#acff46] shrink-0" aria-hidden>
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 pr-8 text-sm text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
