"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  // 1. State must be declared inside the ContactPage component body
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message && formData.agreed) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      <NavBar />

      {/* Hero Header */}
      <section className="pt-32 pb-12 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto text-center">
        <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mb-3">
          CONTACT US
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight mb-4">
          Get in touch with us
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Fill out the form below or schedule a meeting with us at your convenience.
        </p>
      </section>

      {/* Main Contact Section */}
      <section className="pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-6 space-y-6">
              {submitted ? (
                <div className="p-8 bg-neutral-950 border border-[#d85a00]/40 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 bg-[#d85a00]/20 rounded-full flex items-center justify-center text-[#d85a00] text-2xl mx-auto font-bold">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-white">Message Sent!</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Thank you for reaching out. One of our structural roofing specialists will be in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold uppercase text-[#d85a00] hover:underline pt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d85a00] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d85a00] transition-colors"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d85a00] transition-colors resize-none"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                      className="w-4 h-4 accent-[#d85a00] bg-neutral-950 border-neutral-800 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-neutral-400 cursor-pointer">
                      I agree with{" "}
                      <Link 
                        href="/terms" 
                        target="_blank" 
                        className="underline text-neutral-300 hover:text-white transition-colors"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#1e232a] hover:bg-[#d85a00] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-600/20"
                  >
                    Send Your Request
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Benefits & Offices */}
            <div className="lg:col-span-6 space-y-10">
              {/* Service Value Props */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  With our services you can
                </h3>
                <ul className="space-y-4">
                  {[
                    "Protect your structural investments with zero guesswork",
                    "Engage with certified specialists for premium durability",
                    "Reduce maintenance downtime and prevent costly leaks",
                    "Balance immediate protection needs with long-term budget goals",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-xs text-neutral-300 flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm text-neutral-300 leading-snug">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Office Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase">
                    <span className="text-[#d85a00]">📍</span> Headquarters
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    280 W, 17th Street<br />
                    4th floor, Flat no: 407<br />
                    New York NY, 10018
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase">
                    <span className="text-[#d85a00]">📍</span> Regional Facility
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Plot No 8-2-601/p/15ms<br />
                    Industrial Zone, Sector 10<br />
                    Dallas TX, 75001
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Direct Contact Bar */}
          <div className="mt-12 pt-8 border-t border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              You can also Contact Us via
            </h4>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href="mailto:contact.ezroof@gmail.com"
                className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-full px-5 py-2.5 hover:border-[#d85a00] transition-colors group"
              >
                <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center text-xs text-neutral-300 group-hover:text-[#d85a00]">
                  ✉
                </div>
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-white">
                  contact.ezroof@gmail.com
                </span>
              </a>

              <a
                href="tel:+18005550199"
                className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-full px-5 py-2.5 hover:border-[#d85a00] transition-colors group"
              >
                <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center text-xs text-neutral-300 group-hover:text-[#d85a00]">
                  📞
                </div>
                <span className="text-xs font-semibold text-neutral-300 group-hover:text-white">
                  +1 (800) 555-0199
                </span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}