import Link from "next/link";
import { Phone, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function Hero() {
  return (
    <section className="relative w-full bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-10 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
              Licensed plumbing contractor
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02] text-white">
              Fixed right on the first visit.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 max-w-[52ch]">
              Repairs, drains, water heaters and full repipes with upfront
              pricing and a 5-year labor warranty.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Get Free Estimate
                <ArrowRight size={16} weight="bold" aria-hidden />
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

          <div className="lg:col-span-6 w-full">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1400"
                alt="Plumber tightening a fitting under a kitchen sink"
                className="w-full h-[300px] sm:h-[400px] lg:h-[460px] object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Trap replacement in progress, photographed on site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
