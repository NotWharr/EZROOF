"use client";

import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import EstimateCta from "@/components/layout/EstimateCta";
import { MapPin, Clock, ArrowsLeftRight } from "@phosphor-icons/react";

interface Project {
  id: number;
  title: string;
  category: "Residential" | "Commercial" | "Drains" | "Water Heaters";
  description: string;
  location: string;
  date: string;
  beforeImg: string;
  afterImg: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Galvanized to PEX repipe",
    category: "Residential",
    description:
      "Two bath home repiped in PEX with new stops, balanced pressure and drywall patches included.",
    location: "Riverside",
    date: "Mar 2026",
    beforeImg:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Tank to tankless swap",
    category: "Water Heaters",
    description:
      "50 gallon tank replaced with a high efficiency tankless unit, new venting and gas line.",
    location: "Westbrook",
    date: "Jan 2026",
    beforeImg:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Restaurant drain rescue",
    category: "Commercial",
    description:
      "Grease choked main cleared by hydro jetting, then a service plan to keep the kitchen open.",
    location: "Milltown",
    date: "Nov 2025",
    beforeImg:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Trenchless sewer renewal",
    category: "Drains",
    description:
      "Collapsed clay lateral relined trenchless in one day. Lawn untouched, flow restored.",
    location: "Lakeshore",
    date: "Feb 2026",
    beforeImg:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Bathroom rough in and trim",
    category: "Residential",
    description:
      "Full rough in for a remodel plus fixture trim, pressure balanced and leak tested.",
    location: "Hillcrest",
    date: "Oct 2025",
    beforeImg:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Office restroom refit",
    category: "Commercial",
    description:
      "Four restroom cores refit with sensor flush valves and new carriers over one weekend.",
    location: "Northside",
    date: "Aug 2025",
    beforeImg:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    afterImg:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <article className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="relative h-64 w-full overflow-hidden select-none bg-zinc-950">
        <img
          src={project.afterImg}
          alt={`${project.title}, finished work`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <img
          src={project.beforeImg}
          alt={`${project.title}, before work started`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          loading="lazy"
        />
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-[#acff46]" />
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#acff46] rounded-xl flex items-center justify-center text-zinc-950">
            <ArrowsLeftRight size={16} weight="bold" aria-hidden />
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          aria-label={`Reveal before and after for ${project.title}`}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <p className="font-mono text-xs text-[#acff46]">{project.category}</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight">{project.title}</h2>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{project.description}</p>
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#acff46]" aria-hidden />
            {project.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#acff46]" aria-hidden />
            {project.date}
          </span>
        </div>
      </div>
      <p className="px-6 pb-4 font-mono text-xs text-zinc-500">
        Drag slider: left shows before, right shows after.
      </p>
    </article>
  );
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Residential", "Commercial", "Drains", "Water Heaters"];

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#acff46]">
          Project gallery
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02] max-w-[20ch]">
          Jobs that still run clean.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400 max-w-[60ch]">
          Six recent jobs across every service we run. Drag each slider to
          compare before and after.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`px-4 py-3.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ${
                activeCategory === category
                  ? "bg-[#acff46] text-zinc-950"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <p className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-sm text-zinc-400">
            No projects in this category yet. Check back soon or browse the full gallery.
          </p>
        )}
      </section>

      <EstimateCta />
      <Footer />
    </main>
  );
}
