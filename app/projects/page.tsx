"use client";

import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Project Data Type
interface Project {
  id: number;
  title: string;
  category: "Residential" | "Commercial" | "Storm Repair" | "Metal Roofing";
  description: string;
  location: string;
  date: string;
  beforeImg: string;
  afterImg: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Architectural Shingle Replacement",
    category: "Residential",
    description: "Complete tear-off of 25-year worn shingles replaced with Class 4 impact-resistant architectural shingles and synthetic underlayment.",
    location: "Austin, TX",
    date: "03-2026 / 04-2026",
    beforeImg: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Standing Seam Metal Roof Retrofit",
    category: "Metal Roofing",
    description: "Upgraded a sagging asphalt roof to a 24-gauge custom matte black standing seam metal roofing system with hidden fasteners.",
    location: "Dallas, TX",
    date: "01-2026 / 02-2026",
    beforeImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Commercial TPO Flat Roof Restoration",
    category: "Commercial",
    description: "Full single-ply 60-mil TPO membrane restoration over a 12,000 sq ft industrial facility, improving energy efficiency.",
    location: "Houston, TX",
    date: "11-2025 / 12-2025",
    beforeImg: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Emergency Hail Storm Restoration",
    category: "Storm Repair",
    description: "Rapid emergency response following severe hail damage. Replaced OSB decking, ice & water shield, and ridge venting.",
    location: "San Antonio, TX",
    date: "02-2026 / 03-2026",
    beforeImg: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Luxury Slate & Tile Re-Roof",
    category: "Residential",
    description: "Precision installation of synthetic slate tiles on a custom luxury villa, complete with copper valley flashings and gutters.",
    location: "Fort Worth, TX",
    date: "10-2025 / 12-2025",
    beforeImg: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Industrial EPDM Membrane Overlay",
    category: "Commercial",
    description: "Removed degraded tar & gravel roof and installed a seamless EPDM rubberized membrane system with new perimeter coping metal.",
    location: "Waco, TX",
    date: "08-2025 / 09-2025",
    beforeImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
];

// Individual Card Component with Before/After Slider
function ProjectCard({ project }: { project: Project }) {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-neutral-700 transition-all duration-300">
      
      {/* Interactive Before/After Image Container */}
      <div className="relative h-64 w-full overflow-hidden select-none">
        
        {/* "After" Image (Base background) */}
        <img
          src={project.afterImg}
          alt={`${project.title} After`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
          After
        </div>

        {/* "Before" Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={project.beforeImg}
            alt={`${project.title} Before`}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-[#d85a00] border border-[#d85a00]/30">
            Before
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#d85a00] shadow-[0_0_10px_rgba(216,90,0,0.8)] pointer-events-none z-10"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 bg-[#d85a00] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            ↔
          </div>
        </div>

        {/* Range Input Control */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
        />
      </div>

      {/* Card Body Information */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#d85a00]">
            {project.category}
          </div>
          <h3 className="text-xl font-black uppercase text-white tracking-tight leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <span>📍</span> {project.location}
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕒</span> {project.date}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Residential", "Commercial", "Storm Repair", "Metal Roofing"];

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      <NavBar />

      <section className="pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
              Discover Our Completed <span className="text-[#d85a00]">Projects</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Every roof replacement we complete is a reflection of our commitment to structural durability, leak prevention, and premium craftsmanship. Drag the image sliders to view before & after transformations.
            </p>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === category
                  ? "bg-[#d85a00] text-white shadow-lg shadow-orange-600/20"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}