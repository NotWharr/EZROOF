import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-16 lg:pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
          Legal
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tighter leading-[1.02]">
          Terms and Conditions
        </h1>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          Last updated: September 2026
        </p>

        <div className="mt-10 space-y-8 border-t border-zinc-800 pt-10">
          <section className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight">1. Introduction</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Welcome to Copperline. By accessing or using our services, submit forms, or standard inquiries, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight">2. Services</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              All service estimates and plumbing consultations provided through this platform are subject to site verification and final contract terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight">3. Privacy & Data</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Information submitted through our contact form will only be used to process your request and respond to your inquiry.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#acff46] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden />
            Back to free estimate
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
