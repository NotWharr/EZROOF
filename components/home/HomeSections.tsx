import Link from "next/link";

interface FeaturedProject {
  id: number;
  title: string;
  image: string;
  category: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    id: 1,
    title: "STANDING-SEAM RESIDENCE",
    category: "Metal Roofing",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "ESTATE ROOF RENEWAL",
    category: "Architectural Shingles",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "MODERN ROOF SYSTEM",
    category: "Synthetic Slate",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    quote:
      "The crew was punctual, clean, and incredibly focused. Our new roof looks built for the next forty years.",
    author: "MARCUS T.",
    location: "RIVERSIDE",
  },
  {
    quote:
      "EZROOF found the leak our last contractor missed and had it repaired before the next storm.",
    author: "SARAH L.",
    location: "HILLCREST",
  },
  {
    quote:
      "Professional from estimate to cleanup. The new metal roof completely changed our home's curb appeal.",
    author: "JAMES R.",
    location: "WESTBROOK",
  },
];

export default function HomeSections() {
  return (
    <div className="w-full bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      {/* SECTION 1: PROVEN ON EVERY PITCH */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1">
            <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
              BUILT IN THE FIELD
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              PROVEN ON EVERY PITCH.
            </h2>
          </div>

          <Link
            href="/projects"
            className="text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-[#d85a00] transition-colors flex items-center gap-2 group"
          >
            <span>VIEW ALL PROJECTS</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href="/projects"
              className="group relative h-96 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-end p-6 shadow-xl"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d85a00]">
                  {project.category}
                </span>
                <h3 className="text-xl font-black uppercase text-white tracking-tight leading-tight group-hover:text-orange-400 transition-colors">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 2: YOUR NEIGHBORHOOD. OUR JOB SITE. */}
      <section className="bg-neutral-200 text-neutral-900 py-20 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
              LOCAL BY DESIGN
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              YOUR NEIGHBORHOOD. OUR JOB SITE.
            </h2>
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed max-w-xl">
              Our crews serve homeowners and commercial properties throughout the region with transparent scheduling, clear communication, and no-surprise workmanship.
            </p>
          </div>

          <div className="lg:col-span-5 bg-neutral-900 text-white rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-3">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                WE'RE ON THE WAY.
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 leading-relaxed">
                NORTHSIDE • WESTBROOK • RIVERSIDE<br />
                MILLTOWN • HILLCREST • LAKESHORE
              </p>
            </div>

            <a
              href="tel:5550147663"
              className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-colors"
            >
              <span className="text-[#d85a00] text-base">📞</span>
              <span>24/7 HOTLINE (555) 014-ROOF</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRUST EARNED. ROOF BY ROOF. */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
            THE WORD ON THE STREET
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            TRUST EARNED. ROOF BY ROOF.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-neutral-100 text-neutral-900 p-8 rounded-2xl space-y-6 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="text-[#d85a00] text-sm tracking-widest font-bold">
                  ★★★★★
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-neutral-800">
                  "{item.quote}"
                </p>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 pt-4 border-t border-neutral-300">
                {item.author} / {item.location}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}