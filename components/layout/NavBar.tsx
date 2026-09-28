"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10 || isOpen) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#d85a00] rounded-lg flex items-center justify-center font-black text-white text-lg group-hover:scale-105 transition-transform">
            EZ
          </div>
          <span className="font-black text-xl tracking-tight text-white uppercase">
            EZ<span className="text-[#d85a00]">Roof</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-[#d85a00] text-neutral-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            aria-label="Toggle navigation"
          >
            <span>Menu</span>
            <span
              className={`text-[#d85a00] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <Link
            href="/contact"
            className="bg-[#d85a00] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-600/20"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-neutral-800/80 bg-neutral-950/95 shadow-2xl px-6 sm:px-12 lg:px-16 py-8 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#d85a00]">
                Navigation
              </div>
              <ul className="space-y-3 text-sm font-semibold uppercase tracking-wider">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#services"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#d85a00]">
                Tools
              </div>
              <ul className="space-y-3 text-sm font-semibold uppercase tracking-wider">
                <li>
                  <Link
                    href="/calculator"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-[#d85a00] transition-colors flex items-center gap-2"
                  >
                    Estimator
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#d85a00]">
                Legal & Support
              </div>
              <ul className="space-y-3 text-sm font-semibold uppercase tracking-wider">
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}