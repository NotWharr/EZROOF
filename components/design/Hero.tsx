import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-neutral-900 text-white overflow-hidden pt-24 pb-12 px-6 sm:px-12 lg:px-16">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=2000"
          alt="Roofing construction site"
          className="w-full h-full object-cover object-center opacity-40 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
      </div>

      {/* Main Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto pt-16">
        
        {/* Top Typography Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Side: Brand Phrase */}
          <div className="md:col-span-5 flex items-start gap-4">
            <div className="w-8 h-8 bg-[#d85a00] flex-shrink-0 flex items-center justify-center transform rotate-45 mt-1">
              <span className="text-white font-bold -rotate-45 text-sm">/</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-white/90">
              From Inspection <br className="hidden sm:inline" /> to Protection.
            </h1>
          </div>

          {/* Right Side: Primary Headline */}
          <div className="md:col-span-7">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-white">
              Residential & Commercial <br /> Roofing Infrastructure.
            </h2>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/20 mb-8" />

        {/* Bottom Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <p className="text-sm tracking-wide text-neutral-300 font-light">
              Built for the Long Haul
            </p>
          </div>

          <div className="md:col-span-4 space-y-6">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal max-w-md">
              Built for property owners who can't risk leaks, structural damage, 
              or project delays. Engineered craftsmanship backed by lifetime warranties.
            </p>
           
          </div>
        </div>

      </div>
    </section>
  );
}