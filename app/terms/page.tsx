import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      <NavBar />

      <section className="pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-4xl mx-auto space-y-8">
        <div>
          <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mb-2">
            LEGAL
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-neutral-400 text-xs mt-2">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6 text-neutral-300 text-sm leading-relaxed border-t border-neutral-800 pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white uppercase">1. Introduction</h2>
            <p>
              Welcome to EZRoof. By accessing or using our services, submit forms, or standard inquiries, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white uppercase">2. Services</h2>
            <p>
              All service estimates and structural consultations provided through this platform are subject to site verification and final contract terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white uppercase">3. Privacy & Data</h2>
            <p>
              Information submitted through our contact form will only be used to process your request and respond to your inquiry.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-neutral-800">
          <Link
            href="/contact"
            className="text-xs font-bold uppercase text-[#d85a00] hover:underline"
          >
            ← Back to Contact Form
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}