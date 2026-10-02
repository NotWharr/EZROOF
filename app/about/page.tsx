import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import EstimateCta from "@/components/layout/EstimateCta";
import FaqSection from "@/components/about/FaqSection";
import { Phone, ArrowRight, ShieldCheck, Broom, FileText } from "@phosphor-icons/react/dist/ssr";

const metrics = [
  { value: "12,400", label: "Jobs completed" },
  { value: "27 yrs", label: "In business" },
  { value: "4.9", label: "Average rating" },
  { value: "90 min", label: "Emergency response" },
];

const crew = [
  {
    name: "Jordan Lee",
    role: "Master plumber, runs residential crews",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    alt: "Portrait of Jordan Lee, master plumber",
  },
  {
    name: "Maya Chen",
    role: "Drain and sewer specialist",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Maya Chen, drain specialist",
  },
  {
    name: "Rafael Ortiz",
    role: "Water heater and repipe tech",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Rafael Ortiz, heater technician",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Licensed and insured",
    body: "Every job runs under license, bond and insurance, with permits pulled where required.",
  },
  {
    icon: Broom,
    title: "Tidy vans, tidy homes",
    body: "Shoe covers, drop cloths and a fixture by fixture water test before we leave.",
  },
  {
    icon: FileText,
    title: "Written warranty",
    body: "5-year labor coverage in the contract, not just spoken at the door.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
              About Copperline
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
              Plumbers who answer the phone.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 max-w-[52ch]">
              Family run since 1999. Residential and commercial crews who keep
              water flowing where it should.
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
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
                alt="Copperline crew staging a commercial rough in"
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Our crew staging a commercial rough in, photographed on site.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-t-2 border-[#acff46] pt-4">
              <p className="font-mono text-3xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                alt="Portrait of Michael Torres, founder of Copperline Plumbing"
                className="w-full h-[360px] sm:h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Michael Torres, founder. Still rides along on Friday calls.
            </p>
          </div>
          <div className="lg:col-span-7">
            <blockquote className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
              “Plumbing should be simple and transparent. We show up fast,
              photograph everything and stand behind the work in writing.”
            </blockquote>
            <p className="mt-4 text-sm text-zinc-400">
              Michael Torres - Founder and CEO, Copperline
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter max-w-[22ch]">
            The people who will fix your pipes.
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <figure className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src={crew[0].image}
                  alt={crew[0].alt}
                  className="w-full h-80 sm:h-[380px] object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-bold tracking-tight">{crew[0].name}</span>
                <span className="font-mono text-xs text-zinc-400">{crew[0].role}</span>
              </figcaption>
            </figure>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {crew.slice(1).map((member) => (
                <figure key={member.name}>
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img
                      src={member.image}
                      alt={member.alt}
                      className="w-full h-56 lg:h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="font-bold tracking-tight text-sm">{member.name}</span>
                    <span className="font-mono text-xs text-zinc-400">{member.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
            How we work, every job.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="border-t-2 border-[#acff46] pt-5">
                <value.icon size={26} className="text-[#acff46]" aria-hidden />
                <h3 className="mt-3 text-lg font-bold tracking-tight">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <EstimateCta />
      <Footer />
    </main>
  );
}
