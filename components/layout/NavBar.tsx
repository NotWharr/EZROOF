"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, Phone } from "@phosphor-icons/react";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/projects" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Copperline Plumbing home">
          <span className="w-8 h-8 bg-[#acff46] rounded-xl flex items-center justify-center font-bold text-zinc-950 text-sm">
            CL
          </span>
          <span className="font-bold text-lg tracking-tight text-white uppercase">
            Copper<span className="text-[#acff46]">line</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+15550147663"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <Phone size={16} weight="bold" className="text-[#acff46]" aria-hidden />
            (555) 014-7663
          </a>
          <Link
            href="/contact"
            className="bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Get Free Estimate
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/contact"
            className="bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-4 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Get Free Estimate
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-zinc-800 text-zinc-200 hover:text-white hover:border-[#acff46] transition-colors"
          >
            {isOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="tel:+15550147663"
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <Phone size={16} weight="bold" className="text-[#acff46]" aria-hidden />
                Call (555) 014-7663
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
