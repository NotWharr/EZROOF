import Link from "next/link";
import { Phone, Envelope, MapPin } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="font-bold text-3xl tracking-tight uppercase">
              Copper<span className="text-[#acff46]">line</span>
            </p>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-sm">
              Repairs, drains, water heaters and repipes for homes and
              businesses. Flowing right since 1999.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Get Free Estimate
            </Link>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="text-sm font-bold text-zinc-400">
              Company
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold">
              <li>
                <Link href="/about" className="text-zinc-300 hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-zinc-300 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-zinc-300 hover:text-white transition-colors">
                  Cost estimator
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-300 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-sm font-bold text-zinc-400">
              Reach us
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+15550147663"
                  className="flex items-center gap-2 font-semibold text-white hover:text-[#acff46] transition-colors"
                >
                  <Phone size={16} className="text-[#acff46]" aria-hidden />
                  (555) 014-7663
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@copperline.com"
                  className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                >
                  <Envelope size={16} className="text-[#acff46]" aria-hidden />
                  hello@copperline.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <MapPin size={16} className="text-[#acff46]" aria-hidden />
                2400 Industrial Way, Riverside
              </li>
              <li className="text-zinc-400">Mon-Fri 7AM-6PM, Sat 8AM-2PM</li>
              <li className="font-bold text-white">Burst pipe line open 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-zinc-500">© 2026 Copperline Plumbing. Concept website, not a real business.</p>
          <p className="text-xs text-zinc-500">Licensed, bonded and insured.</p>
        </div>
      </div>
    </footer>
  );
}
