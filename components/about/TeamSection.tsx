"use client";

import React from "react";

const teamMembers = [
  {
    name: "Jordan Lee",
    role: "Senior Project Manager",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Maya Chen",
    role: "Certified Structural Specialist",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Rafael Ortiz",
    role: "Lead Commercial Estimator",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto space-y-24">
      {/* 1. Founder Quote Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              alt="Michael Johnson - Founder & CEO"
              className="w-full h-[360px] sm:h-[420px] object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <p className="text-neutral-300 text-lg sm:text-xl font-normal leading-relaxed">
            "We believe roofing should be simple, transparent, and built on trust. Our team is dedicated to providing expert guidance, modern solutions, and personalized support to make every building and investment journey smooth and successful."
          </p>

          <div className="space-y-1 pt-2">
            <h3 className="text-xl font-bold uppercase text-white tracking-wider">
              Michael Johnson
            </h3>
            <p className="text-xs font-semibold uppercase text-[#d85a00] tracking-widest">
              Founder & CEO of EZROOF
            </p>
            <p className="font-serif italic text-2xl text-neutral-400 pt-2 opacity-80">
              Michael Johnson
            </p>
          </div>
        </div>
      </div>

      {/* 2. Trusted Team Roster */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
            EXPERTS BEHIND OUR WORK
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Trusted Roofing Specialists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-neutral-700 transition-all duration-300"
            >
              <div className="w-full h-80 rounded-xl overflow-hidden mb-5 bg-neutral-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                {member.name}
              </h3>
              <p className="text-xs text-neutral-400 font-medium mt-1 mb-4">
                {member.role}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 text-neutral-500 text-xs pt-2 border-t border-neutral-800 w-full justify-center">
                <span className="hover:text-[#d85a00] cursor-pointer transition-colors">FB</span>
                <span>•</span>
                <span className="hover:text-[#d85a00] cursor-pointer transition-colors">TW</span>
                <span>•</span>
                <span className="hover:text-[#d85a00] cursor-pointer transition-colors">IG</span>
                <span>•</span>
                <span className="hover:text-[#d85a00] cursor-pointer transition-colors">LN</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}