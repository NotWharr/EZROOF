"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  solutions: string[];
  image: string;
}

const servicesData: Service[] = [
  {
    id: "01",
    number: "01",
    title: "Residential Roof Replacement",
    subtitle: "Complete home protection with architectural shingles & standing seam metal.",
    description:
      "We replace aging or storm-damaged residential roofs with high-durability systems designed to withstand wind, hail, and extreme temperatures. Complete with full tear-off, deck inspection, and synthetic underlayment.",
    solutions: ["Architectural & Impact Shingles", "Synthetic Underlayment", "Ice & Water Shielding"],
    image: "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    number: "02",
    title: "Commercial Flat Roof Systems",
    subtitle: "Single-ply TPO, EPDM, and modified bitumen waterproofing.",
    description:
      "Engineered flat roof installations and restorations for warehouses, retail plazas, and office buildings. Highly reflective TPO membranes reduce HVAC energy costs while offering leak-proof seamless protection.",
    solutions: ["60-Mil TPO Membrane", "EPDM Rubber Systems", "Parapet Flashing & Coping"],
    image: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    number: "03",
    title: "Emergency Storm Damage Repair",
    subtitle: "24/7 rapid tarping, hail inspection, and insurance claim support.",
    description:
      "When severe storms compromise your roof structure, our emergency response crews arrive within hours for rapid tarping, detailed hail damage reports, and direct adjuster negotiation.",
    solutions: ["Emergency Tarping & Sealing", "Insurance Claim Documentation", "Structural OSB Deck Repair"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    number: "04",
    title: "Custom Metal & Slate Roofing",
    subtitle: "Premium architectural metal panels and synthetic slate tile systems.",
    description:
      "Elevate your property's aesthetics and lifespan with 24-gauge standing seam metal or lightweight synthetic slate tiles. Engineered for a 50+ year lifespan with minimal maintenance required.",
    solutions: ["Snap-Lock Standing Seam", "Copper Flashing & Gutters", "Synthetic Slate Tile"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ServicesStickySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const totalScrollable = rect.height - window.innerHeight;

            if (totalScrollable > 0) {
              const currentScroll = -rect.top;
              const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
              const newIndex = Math.min(
                servicesData.length - 1,
                Math.floor(progress * servicesData.length)
              );
              setActiveIdx(newIndex);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-neutral-950 text-white"
      style={{ height: `${servicesData.length * 110}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 z-20">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Our Core <span className="text-[#d85a00]">Services</span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              0{activeIdx + 1} / 0{servicesData.length}
            </span>
          </div>
        </div>

        {/* Content Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-4 z-10">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 h-[320px] sm:h-[460px] rounded-3xl overflow-hidden relative border border-neutral-800 shadow-2xl bg-neutral-900">
            {servicesData.map((service, index) => {
              const isActive = index === activeIdx;
              return (
                <div
                  key={service.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                </div>
              );
            })}
          </div>

          {/* Right Column: Text */}
          <div className="lg:col-span-5 relative h-[280px] sm:h-[340px] flex flex-col justify-center">
            {servicesData.map((service, index) => {
              const isActive = index === activeIdx;
              return (
                <div
                  key={service.id}
                  className={`absolute inset-0 flex flex-col justify-center space-y-5 transition-all duration-500 ease-out ${
                    isActive
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-6 pointer-events-none"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d85a00] bg-[#d85a00]/10 border border-[#d85a00]/30 px-3 py-1 rounded-full w-max inline-block">
                      Service {service.number}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-neutral-300">
                      {service.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Key Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.solutions.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d85a00]" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden z-20">
          <div
            className="bg-[#d85a00] h-full transition-all duration-300 ease-out"
            style={{ width: `${((activeIdx + 1) / servicesData.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}