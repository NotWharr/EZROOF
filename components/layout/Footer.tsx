import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white py-16 px-6 sm:px-12 md:px-20 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Column 1: Brand */}
          <div className="md:col-span-5 space-y-3">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              EZROOF
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-sm leading-relaxed font-normal">
              Roofing systems built with grit, precision, and pride.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
              CONTACT
            </h3>
            <ul className="space-y-1.5 text-sm sm:text-base font-medium text-white">
              <li>
                <a 
                  href="tel:5550147663" 
                  className="hover:text-[#d85a00] transition-colors"
                >
                  (555) 014-ROOF
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@ezroof.com" 
                  className="hover:text-[#d85a00] transition-colors"
                >
                  hello@ezroof.com
                </a>
              </li>
              <li className="text-neutral-300">
                2400 Industrial Way, Riverside
              </li>
            </ul>
          </div>

          {/* Column 3: Hours */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
              HOURS
            </h3>
            <ul className="space-y-1.5 text-sm sm:text-base font-medium text-white">
              <li className="flex gap-4">
                <span className="w-24 text-neutral-300">MON–FRI</span>
                <span>7AM–6PM</span>
              </li>
              <li className="flex gap-4">
                <span className="w-24 text-neutral-300">SATURDAY</span>
                <span>8AM–2PM</span>
              </li>
              <li className="text-white font-semibold pt-1">
                24/7 EMERGENCY RESPONSE
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900/50">
          <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
            © 2026 EZROOF. BUILT FOR THE LONG HAUL.
          </p>
        </div>
      </div>
    </footer>
  );
}