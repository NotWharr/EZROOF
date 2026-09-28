"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Counter from "@/components/about/Counter";
import TeamSection from "@/components/about/TeamSection";
import FaqSection from "@/components/about/FaqSection";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop";

export default function AboutPage() {
  const [imgSrc, setImgSrc] = useState(HERO_IMAGE_URL);

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mb-6">
          <Link href="/" className="hover:underline">HOME</Link> / <span className="text-neutral-400">ABOUT US</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none font-sans">
              CRAFTING EXCELLENCE <br /> TOGETHER
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              At EZROOF, we believe in the power of precision craftsmanship and relentless commitment. With a team of skilled roofing professionals and structural engineers, we work hand-in-hand with residential and commercial clients to protect what matters most.
            </p>
          </div>

          <div className="lg:col-span-6 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-700 transform ease-out hover:scale-[1.02] hover:-translate-y-2">
              <img
                src={imgSrc}
                alt="EZROOF Team on Site"
                onError={() =>
                  setImgSrc(
                    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop"
                  )
                }
                className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-[#d85a00] w-28 h-28 rounded-full flex items-center justify-center border-4 border-neutral-950 shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 z-20">
              <div className="text-center font-black text-[11px] tracking-widest text-white uppercase leading-tight">
                ★ EZROOF ★<br />EST. 2012
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <Counter end={150} suffix="+" />
            </h3>
            <p className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mt-3">
              COMPLETED PROJECTS
            </p>
          </div>

          <div className="p-4 border-l border-neutral-800">
            <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <Counter end={100} suffix="+" />
            </h3>
            <p className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mt-3">
              TEAM MEMBERS
            </p>
          </div>

          <div className="p-4 md:border-l border-neutral-800">
            <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <Counter end={200} suffix="+" />
            </h3>
            <p className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mt-3">
              CLIENT REVIEWS
            </p>
          </div>

          <div className="p-4 border-l border-neutral-800">
            <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              <Counter end={30} />
            </h3>
            <p className="text-xs font-bold tracking-widest text-[#d85a00] uppercase mt-3">
              INDUSTRY AWARDS
            </p>
          </div>
        </div>
      </section>

      {/* Team & Founder Section */}
      <TeamSection />

      {/* FAQ Section */}
      <FaqSection />

      <Footer />
    </main>
  );
}