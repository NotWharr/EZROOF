"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  Wrench,
  SealCheck,
  ArrowUpRight,
  Star,
  Phone,
  MapPin,
  Clock,
  Plus,
  Minus,
} from "@phosphor-icons/react";

const projects = [
  {
    title: "Galvanized to PEX repipe",
    material: "Whole home, 2 baths",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    alt: "Renovated bathroom after a full repipe",
  },
  {
    title: "Tank to tankless swap",
    material: "Endless hot water",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    alt: "Modern bathroom vanity with wall mounted fixtures",
  },
  {
    title: "Trenchless sewer renewal",
    material: "No dig replacement",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    alt: "Finished bathroom served by a renewed sewer line",
  },
];

const testimonials = [
  {
    quote: "Found the slab leak two others missed and had it fixed the same day.",
    name: "Marcus Bell",
    detail: "Homeowner, Riverside",
  },
  {
    quote: "Tankless swap done in a day, with the old tank hauled away.",
    name: "Priya Nair",
    detail: "Homeowner, Hillcrest",
  },
  {
    quote: "Upfront flat price, shoe covers on, zero surprises on the invoice.",
    name: "Dan Whitfield",
    detail: "Property manager, Westbrook",
  },
];

const faqs = [
  {
    question: "How fast can you get here?",
    answer:
      "Emergency calls get a 90 minute response window. Standard jobs book within 48 hours.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. Every job is run by a licensed, bonded and insured crew, with permits pulled where required.",
  },
  {
    question: "Do you fix sewers without digging?",
    answer:
      "Yes. We camera inspect first, then line or burst the pipe trenchless wherever the line allows.",
  },
  {
    question: "Should I flush my water heater?",
    answer:
      "Yearly in hard water areas. Our flush service takes under an hour and extends tank life for years.",
  },
  {
    question: "Do I get the price before you start?",
    answer:
      "Always. You approve a flat written quote first. The invoice matches it or the extra work is free.",
  },
];

export default function HomeSections() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full bg-zinc-950 text-white">
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter max-w-[22ch]">
            Flat quote in one visit or less.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MagnifyingGlass,
                title: "Diagnose",
                body: "Camera inspection and pressure tests with photos you keep.",
              },
              {
                icon: Wrench,
                title: "Fix",
                body: "Shoe covers on, water tested at every fixture before we leave.",
              },
              {
                icon: SealCheck,
                title: "Backed",
                body: "Walkthrough plus a 5-year labor warranty in writing.",
              },
            ].map((step) => (
              <div key={step.title} className="border-t-2 border-[#acff46] pt-5">
                <step.icon size={26} className="text-[#acff46]" aria-hidden />
                <h3 className="mt-3 text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">
              Recent jobs, still dry today.
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#acff46] hover:text-white transition-colors shrink-0"
            >
              View all projects
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <figure className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src={projects[0].image}
                  alt={projects[0].alt}
                  className="w-full h-80 sm:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-bold tracking-tight">{projects[0].title}</span>
                <span className="font-mono text-xs text-zinc-400">{projects[0].material}</span>
              </figcaption>
            </figure>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {projects.slice(1).map((project) => (
                <figure key={project.title}>
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="w-full h-56 lg:h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="font-bold tracking-tight text-sm">{project.title}</span>
                    <span className="font-mono text-xs text-zinc-400">{project.material}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
            Homeowner reviews
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter max-w-[22ch]">
            Rated on shoe covers as much as soldering.
          </h2>

          <blockquote className="mt-10 max-w-3xl">
            <div className="flex gap-1 text-[#acff46]" aria-label="Rated 5 out of 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} weight="fill" aria-hidden />
              ))}
            </div>
            <p className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              “Found the slab leak two others missed and had it fixed the same
              day.”
            </p>
            <footer className="mt-4 text-sm text-zinc-400">
              Marcus Bell - Homeowner, Riverside
            </footer>
          </blockquote>

          <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x">
            {testimonials.slice(1).map((item) => (
              <figure
                key={item.name}
                className="min-w-[280px] sm:min-w-[340px] snap-start rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex gap-1 text-[#acff46]" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} weight="fill" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-zinc-200 leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs text-zinc-500">
                  {item.name} - {item.detail}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">
              Local vans, fast arrival.
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-[60ch]">
              We run stocked vans across six districts, so the part for your
              fix is usually already on board.
            </p>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Northside",
                "Westbrook",
                "Riverside",
                "Milltown",
                "Hillcrest",
                "Lakeshore",
              ].map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-200"
                >
                  <MapPin size={16} className="text-[#acff46]" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
              <Clock size={16} className="text-[#acff46]" aria-hidden />
              Mon-Fri 7AM-6PM, Sat 8AM-2PM, burst pipe line open 24/7.
            </p>
          </div>

          <aside className="lg:col-span-5 rounded-2xl bg-[#acff46] text-zinc-950 p-8">
            <h3 className="text-2xl font-bold tracking-tight">Burst pipe right now?</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed">
              Call the burst pipe line. We stop the water today and quote free.
            </p>
            <a
              href="tel:+15550147663"
              className="mt-6 flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <Phone size={16} weight="bold" aria-hidden />
              (555) 014-7663
            </a>
            <Link
              href="/contact"
              className="mt-3 flex items-center justify-center gap-2 border-2 border-zinc-950/30 hover:border-zinc-950 text-zinc-950 font-bold text-sm px-5 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Get Free Estimate
            </Link>
          </aside>
        </div>
      </section>

      <section id="faq" className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
              Questions, answered plainly.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
              Response times, warranties, trenchless options and pricing. Still
              unsure? Send one message and get a human reply.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Get Free Estimate
            </Link>
          </div>
          <div className="lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex justify-between items-center gap-4 py-5 text-left font-bold text-white hover:text-[#acff46] transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    {isOpen ? (
                      <Minus size={18} className="text-[#acff46] shrink-0" aria-hidden />
                    ) : (
                      <Plus size={18} className="text-[#acff46] shrink-0" aria-hidden />
                    )}
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

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 sm:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
              Get plumbing you stop thinking about.
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-[55ch]">
              Free inspections, upfront pricing, 5-year labor warranty. Most
              quotes delivered within 48 hours.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Get Free Estimate
              </Link>
              <a
                href="tel:+15550147663"
                className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-400 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Phone size={16} weight="bold" className="text-[#acff46]" aria-hidden />
                (555) 014-7663
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
