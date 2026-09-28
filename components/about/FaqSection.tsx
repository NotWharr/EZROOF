"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How do I request an inspection or estimate for my roof?",
    answer:
      "You can fill out our online quote form, request a callback through our contact page, or call our team directly. We schedule on-site inspections promptly to evaluate your roof's condition.",
  },
  {
    question: "Are EZROOF's contractors licensed and insured?",
    answer:
      "Yes, all EZROOF projects are managed by fully licensed, bonded, and insured structural specialists and roofing professionals. We prioritize complete safety and compliance.",
  },
  {
    question: "What type of roofing materials do you specialize in?",
    answer:
      "We specialize in architectural asphalt shingles, standing seam metal roofing, commercial TPO/EPDM flat systems, and eco-friendly solar-ready roofing solutions.",
  },
  {
    question: "Do you offer emergency leak and storm repair services?",
    answer:
      "Absolutely. Our rapid-response emergency repair team is available 24/7 to handle active leaks, storm impact, and immediate structural vulnerabilities.",
  },
  {
    question: "How long does a standard residential roof replacement take?",
    answer:
      "Most residential replacements are completed within 1 to 2 days, depending on roof size and weather conditions. We perform full cleanup after every job.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto border-t border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Header & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
              GOT QUESTIONS?
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
              Find quick answers about roof inspections, warranties, material options, repair timelines, and emergency support.
            </p>
          </div>

          <div className="pt-8 border-t border-neutral-800 space-y-4">
            <h4 className="text-lg font-bold text-white uppercase">Still Have A Question?</h4>
            <p className="text-xs text-neutral-400">
              Every project consultation is designed to be clear, transparent, and stress-free.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#d85a00] hover:bg-[#b84d00] text-white text-xs font-bold px-6 py-3 tracking-widest uppercase transition-colors rounded-xs shadow-md"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:col-span-7 divide-y divide-neutral-800">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left text-base font-bold text-white hover:text-[#d85a00] transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  <span className="text-2xl font-mono text-[#d85a00] flex-shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-neutral-400 text-sm leading-relaxed pr-6 animate-in fade-in duration-300">
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