import Link from "next/link";
import {
  House,
  Warehouse,
  Lightning,
  Drop,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";

const services = [
  {
    icon: House,
    title: "Emergency leak repair",
    body: "Burst pipes, failed valves and active leaks stopped fast, any hour.",
    points: ["Same day dispatch", "Shutoff and dry out", "Pipe and valve rebuild"],
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
    alt: "Plumber repairing a pipe fitting under a sink",
  },
  {
    icon: Lightning,
    title: "Drains and sewer",
    body: "Camera inspection, cable clearing and hydro jetting that keeps lines open.",
    points: ["Camera locating", "Hydro jetting", "Trenchless repair"],
    image: null,
    alt: "",
  },
  {
    icon: Drop,
    title: "Water heaters",
    body: "Tank and tankless installs, yearly flushes and same day swaps.",
    points: ["Tank and tankless", "Yearly flush service", "Expansion tanks"],
    image: null,
    alt: "",
  },
  {
    icon: Warehouse,
    title: "Repipes and remodels",
    body: "Whole home PEX and copper repipes plus bathroom rough ins.",
    points: ["PEX and copper", "Bathroom rough ins", "Pressure balancing"],
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    alt: "Renovated bathroom with new fixtures and tile",
  },
];

export default function ServicesStickySection() {
  return (
    <section id="services" className="bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white max-w-[20ch]">
          Every pipe, drain and heater.
        </h2>
        <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-[65ch]">
          Four services cover 95 percent of what we fix. Pick yours and get a
          flat quote before any wrench turns.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          <article className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
            <img
              src={services[0].image as string}
              alt={services[0].alt}
              className="w-full h-64 sm:h-72 object-cover"
              loading="lazy"
            />
            <div className="p-7">
              <House size={26} className="text-[#acff46]" aria-hidden />
              <h3 className="mt-3 text-xl font-bold tracking-tight">{services[0].title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{services[0].body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {services[0].points.map((point) => (
                  <li
                    key={point}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-7 flex flex-col justify-between">
            <div>
              <Lightning size={26} className="text-[#acff46]" aria-hidden />
              <h3 className="mt-3 text-xl font-bold tracking-tight">{services[1].title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{services[1].body}</p>
            </div>
            <ul className="mt-6 space-y-2">
              {services[1].points.map((point) => (
                <li
                  key={point}
                  className="flex items-center justify-between border-b border-zinc-800 pb-2 text-sm text-zinc-200"
                >
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <article className="lg:col-span-5 rounded-2xl border border-[#acff46]/40 bg-[#acff46]/10 p-7 flex flex-col justify-between">
            <div>
              <Drop size={26} className="text-[#acff46]" aria-hidden />
              <h3 className="mt-3 text-xl font-bold tracking-tight">{services[2].title}</h3>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{services[2].body}</p>
            </div>
            <a
              href="tel:+15550147663"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#acff46] hover:bg-[#8fe63e] text-zinc-950 font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Call the burst pipe line
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
          </article>

          <article className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col md:flex-row">
            <img
              src={services[3].image as string}
              alt={services[3].alt}
              className="w-full md:w-1/2 h-64 md:h-auto object-cover"
              loading="lazy"
            />
            <div className="p-7 flex-1">
              <Warehouse size={26} className="text-[#acff46]" aria-hidden />
              <h3 className="mt-3 text-xl font-bold tracking-tight">{services[3].title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{services[3].body}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {services[3].points.map((point) => (
                  <li
                    key={point}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#acff46] hover:text-white transition-colors"
              >
                Get Free Estimate
                <ArrowUpRight size={16} weight="bold" aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
