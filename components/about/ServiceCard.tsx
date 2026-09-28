"use client";

import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <div className="bg-[#f4f4f2] text-neutral-900 border-t-4 border-[#d85a00] p-8 flex flex-col justify-between h-full transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl rounded-b-xl">
      <div>
        {/* Top Icon */}
        <div className="text-[#d85a00] mb-6 text-3xl">{icon}</div>

        {/* Headline */}
        <h3 className="text-2xl font-black tracking-tight uppercase leading-none mb-4 text-neutral-950">
          {title}
        </h3>

        {/* Body Copy */}
        <p className="text-neutral-600 text-sm leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}