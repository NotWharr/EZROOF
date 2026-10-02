"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  Envelope,
  MapPin,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
  agreed?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agreed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (formData.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email so we can reply.";
    if (formData.message.trim().length < 10)
      next.message = "Tell us a little more, at least a sentence.";
    if (!formData.agreed) next.agreed = "Please accept the terms first.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  const inputClass =
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#acff46] transition-colors";

  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
          Contact
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
          Get your free estimate.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400 max-w-[60ch]">
          Send the form and get a flat written quote. Most replies land within
          one business day.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-10">
            {submitted ? (
              <div
                aria-live="polite"
                className="rounded-2xl border border-[#acff46]/40 bg-zinc-950 p-8 text-center"
              >
                <CheckCircle size={40} weight="fill" className="text-[#acff46] mx-auto" aria-hidden />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Request received</h2>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
                  Thanks, {formData.name.split(" ")[0]}. A plumber will reply
                  at {formData.email} within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", message: "", agreed: false });
                    setErrors({});
                  }}
                  className="mt-6 text-sm font-bold text-[#acff46] hover:text-white transition-colors"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold text-zinc-200">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jordan Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-zinc-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : "email-help"}
                    className={inputClass}
                  />
                  {errors.email ? (
                    <p id="email-error" className="text-xs text-red-400">{errors.email}</p>
                  ) : (
                    <p id="email-help" className="text-xs text-zinc-500">
                      We reply within one business day. No spam, ever.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-zinc-200">
                    Job details
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Kitchen drain backs up every night. Two story home, galvanized pipes, built in the 70s."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-red-400">{errors.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                      aria-invalid={Boolean(errors.agreed)}
                      aria-describedby={errors.agreed ? "terms-error" : undefined}
                      className="mt-1 w-4 h-4 accent-[#acff46] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-zinc-300 cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="underline hover:text-white transition-colors">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  {errors.agreed && (
                    <p id="terms-error" className="text-xs text-red-400">{errors.agreed}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-6 py-4 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  Get Free Estimate
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
              <h2 className="text-lg font-bold tracking-tight">Prefer to talk?</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <a
                    href="tel:+15550147663"
                    className="flex items-center gap-3 font-bold text-white hover:text-[#acff46] transition-colors"
                  >
                    <Phone size={18} weight="bold" className="text-[#acff46]" aria-hidden />
                    (555) 014-7663
                  </a>
                  <p className="mt-1 pl-8 text-xs text-zinc-500">Burst pipe line open 24/7.</p>
                </li>
                <li>
                  <a
                    href="mailto:hello@copperline.com"
                    className="flex items-center gap-3 text-zinc-200 hover:text-white transition-colors"
                  >
                    <Envelope size={18} className="text-[#acff46]" aria-hidden />
                    hello@copperline.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-zinc-200">
                  <MapPin size={18} className="text-[#acff46]" aria-hidden />
                  2400 Industrial Way, Riverside
                </li>
                <li className="flex items-center gap-3 text-zinc-200">
                  <Clock size={18} className="text-[#acff46]" aria-hidden />
                  Mon-Fri 7AM-6PM, Sat 8AM-2PM
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#acff46] text-zinc-950 p-7">
              <h2 className="text-lg font-bold tracking-tight">Burst pipe right now?</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed">
                Skip the form and call. We stop the water today and quote free.
              </p>
              <a
                href="tel:+15550147663"
                className="mt-5 flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Phone size={16} weight="bold" aria-hidden />
                (555) 014-7663
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
