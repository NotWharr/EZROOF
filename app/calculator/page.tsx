"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default function CalculatorPage() {
  // Specs
  const [squares, setSquares] = useState<number>(25); // 1 Sq = 100 sq ft
  const [pitch, setPitch] = useState<number>(1.15); // Pitch factor
  const [tearOffLayers, setTearOffLayers] = useState<number>(1); // Layer count
  const [materialCost, setMaterialCost] = useState<number>(380); // Base cost/sq

  // Add-ons & Complexities
  const [valleys, setValleys] = useState<number>(2);
  const [dormers, setDormers] = useState<number>(0);
  const [chimneys, setChimneys] = useState<number>(1);
  const [skylights, setSkylights] = useState<number>(0);
  const [ridgeVentFeet, setRidgeVentFeet] = useState<number>(40);

  // Math Calculations
  const baseMaterialAndLabor = squares * materialCost * pitch;
  const tearOffCost = squares * (tearOffLayers * 55); // ~$55 per sq per layer tear-off + disposal
  const valleyCost = valleys * 150; // W-valley / Ice & water shield detailing
  const dormerCost = dormers * 250; // Step flashing & custom cuts
  const chimneyCost = chimneys * 350; // Counter flashing & cricket install
  const skylightCost = skylights * 450; // Kit replacement & flashing
  const ridgeVentCost = ridgeVentFeet * 12; // Shingle-over ridge vent per linear foot

  const subtotal =
    baseMaterialAndLabor +
    tearOffCost +
    valleyCost +
    dormerCost +
    chimneyCost +
    skylightCost +
    ridgeVentCost;

  const lowEstimate = Math.round(subtotal * 0.92);
  const highEstimate = Math.round(subtotal * 1.08);

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      <NavBar />

      <section className="pt-32 pb-24 px-6 sm:px-12 lg:px-16 max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="text-xs font-bold tracking-widest text-[#d85a00] uppercase">
            Pro Roofing Tools
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Advanced Roof Estimator
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Detailed parameter inputs tailored for contractors, adjusters, and trade professionals.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Section 1: Core Dimensions & Slope */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#d85a00] border-b border-neutral-800 pb-2">
              1. Area, Pitch & Tear-Off
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Roof Squares */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">
                  Total Squares (1 Sq = 100 sq ft)
                </label>
                <input
                  type="number"
                  min={1}
                  value={squares}
                  onChange={(e) => setSquares(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>

              {/* Pitch */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">
                  Roof Pitch / Steepness
                </label>
                <select
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                >
                  <option value={1.0}>Flat / Low Slope (0/12 to 3/12)</option>
                  <option value={1.15}>Standard Walkable (4/12 to 7/12)</option>
                  <option value={1.35}>Steep Slope (8/12 to 10/12)</option>
                  <option value={1.60}>Extreme / Mansard (11/12 to 12/12+)</option>
                </select>
              </div>

              {/* Tear-Off Layers */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">
                  Existing Tear-Off Layers
                </label>
                <select
                  value={tearOffLayers}
                  onChange={(e) => setTearOffLayers(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                >
                  <option value={0}>Overlay (0 Layers — No Tear-off)</option>
                  <option value={1}>1 Layer (Standard Asphalt/Metal)</option>
                  <option value={2}>2 Layers (Double Layer Tear-off)</option>
                  <option value={3}>3 Layers (Heavy Removal / Cedar Split)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Material System */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#d85a00] border-b border-neutral-800 pb-2">
              2. Roofing Material System
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-300">
                Material & Underlayment Grade
              </label>
              <select
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d85a00]"
              >
                <option value={380}>
                  3-Tab / Standard Architectural Shingles + Synthetic Felt ($380/sq)
                </option>
                <option value={480}>
                  Class 4 Impact Resistant Architectural Shingles ($480/sq)
                </option>
                <option value={550}>
                  Commercial TPO / EPDM Single-Ply Membrane ($550/sq)
                </option>
                <option value={750}>
                  Standing Seam Metal (24-Gauge Snap-Lock) ($750/sq)
                </option>
                <option value={1100}>
                  Synthetic Slate / Concrete Interlocking Tile ($1,100/sq)
                </option>
              </select>
            </div>
          </div>

          {/* Section 3: Penetrations & Detail Features */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#d85a00] border-b border-neutral-800 pb-2">
              3. Penetrations & Detail Features
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">Valleys</label>
                <input
                  type="number"
                  min={0}
                  value={valleys}
                  onChange={(e) => setValleys(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">Dormers</label>
                <input
                  type="number"
                  min={0}
                  value={dormers}
                  onChange={(e) => setDormers(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">Chimneys</label>
                <input
                  type="number"
                  min={0}
                  value={chimneys}
                  onChange={(e) => setChimneys(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">Skylights</label>
                <input
                  type="number"
                  min={0}
                  value={skylights}
                  onChange={(e) => setSkylights(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-2">
                <label className="text-xs font-bold uppercase text-neutral-300">Ridge Vent (ft)</label>
                <input
                  type="number"
                  min={0}
                  value={ridgeVentFeet}
                  onChange={(e) => setRidgeVentFeet(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d85a00]"
                />
              </div>
            </div>
          </div>

          {/* Output Display */}
          <div className="pt-8 border-t border-neutral-800 space-y-6">
            <div className="bg-neutral-950 border border-[#d85a00]/30 rounded-2xl p-6 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Estimated Project Range
              </span>
              <div className="text-3xl sm:text-5xl font-black text-[#d85a00] tracking-tight">
                ${lowEstimate.toLocaleString()} – ${highEstimate.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
                Includes labor, tear-off disposal, underlayment, starter strips, ridge cap, and flashing details. Excludes OSB deck replacement if dry rot is discovered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-[#d85a00] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl text-center transition-all shadow-lg hover:shadow-orange-600/20"
              >
                Submit Details for Official Bid →
              </Link>
              <span className="text-xs text-neutral-400">
                Need an on-site inspection? Call us directly: <a href="tel:+18005550199" className="text-white underline">+1 (800) 555-0199</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}