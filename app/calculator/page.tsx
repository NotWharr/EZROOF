"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Phone } from "@phosphor-icons/react";

export default function CalculatorPage() {
  const [jobBase, setJobBase] = useState<number>(189);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [fixtures, setFixtures] = useState<number>(1);
  const [floorsAboveFirst, setFloorsAboveFirst] = useState<number>(0);
  const [heaterSwap, setHeaterSwap] = useState<boolean>(false);
  const [emergency, setEmergency] = useState<boolean>(false);

  const extras =
    Math.max(0, bathrooms - 1) * 140 +
    fixtures * 95 +
    floorsAboveFirst * 120 +
    (heaterSwap ? 1650 : 0) +
    (emergency ? 150 : 0);

  const subtotal = jobBase + extras;
  const lowEstimate = Math.round(subtotal * 0.92);
  const highEstimate = Math.round(subtotal * 1.08);

  const fieldClass =
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#acff46] transition-colors";

  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
          Cost estimator
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
          What will my plumbing cost?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400 max-w-[60ch]">
          Pick your job and home details for a ballpark range. A free visit
          turns it into a flat written quote.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-10 space-y-10">
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-tight border-b border-zinc-800 pb-3">
              Job
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="job" className="block text-sm font-bold text-zinc-200">
                  Service needed
                </label>
                <select
                  id="job"
                  value={jobBase}
                  onChange={(e) => setJobBase(Number(e.target.value))}
                  className={fieldClass}
                >
                  <option value={189}>Drain clearing, one line</option>
                  <option value={240}>Fixture install, per visit</option>
                  <option value={450}>Leak repair, accessible pipe</option>
                  <option value={890}>Sewer camera and jetting</option>
                  <option value={2400}>Repipe, per bathroom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bathrooms" className="block text-sm font-bold text-zinc-200">
                  Bathrooms in the home
                </label>
                <input
                  id="bathrooms"
                  type="number"
                  min={1}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Math.max(1, Number(e.target.value)))}
                  aria-describedby="bathrooms-help"
                  className={fieldClass}
                />
                <p id="bathrooms-help" className="text-xs text-zinc-500">
                  More bathrooms means more pipe, valves and testing time.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-tight border-b border-zinc-800 pb-3">
              Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="fixtures" className="block text-sm font-bold text-zinc-200">
                  Extra fixtures
                </label>
                <input
                  id="fixtures"
                  type="number"
                  min={0}
                  value={fixtures}
                  onChange={(e) => setFixtures(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#acff46] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="floors" className="block text-sm font-bold text-zinc-200">
                  Floors above first
                </label>
                <input
                  id="floors"
                  type="number"
                  min={0}
                  value={floorsAboveFirst}
                  onChange={(e) => setFloorsAboveFirst(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#acff46] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <span id="toggles-label" className="block text-sm font-bold text-zinc-200">
                  Add ons
                </span>
                <div className="space-y-3 pt-1" role="group" aria-labelledby="toggles-label">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heaterSwap}
                      onChange={(e) => setHeaterSwap(e.target.checked)}
                      className="w-4 h-4 accent-[#acff46] cursor-pointer"
                    />
                    Heater swap too
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emergency}
                      onChange={(e) => setEmergency(e.target.checked)}
                      className="w-4 h-4 accent-[#acff46] cursor-pointer"
                    />
                    Emergency callout
                  </label>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-500 leading-relaxed">
                Extras priced per fixture and floor. Emergency adds a flat
                dispatch fee, quoted before we roll.
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800">
            <div className="rounded-2xl bg-zinc-950 border border-[#acff46]/40 p-6 sm:p-8 text-center">
              <p className="font-mono text-xs text-zinc-400">Estimated project range</p>
              <p className="mt-2 font-mono text-3xl sm:text-5xl font-bold text-[#acff46] tracking-tight">
                ${lowEstimate.toLocaleString()} - ${highEstimate.toLocaleString()}
              </p>
              <p className="mx-auto mt-3 text-xs text-zinc-500 max-w-xl leading-relaxed">
                Covers labor, parts, testing and cleanup. Hidden damage found
                mid job is quoted separately before we proceed.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-8 py-4 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Get Free Estimate
              </Link>
              <a
                href="tel:+15550147663"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
              >
                <Phone size={16} weight="bold" className="text-[#acff46]" aria-hidden />
                Questions? Call (555) 014-7663
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
