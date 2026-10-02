import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr";

export default function EstimateCta() {
  return (
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
  );
}
