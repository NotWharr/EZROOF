import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/design/Hero";
import Footer from "@/components/layout/Footer";
import HomeSections from "@/components/home/HomeSections";
import ServicesStickySection from "@/components/home/ServicesStickySection";
import TrustStrip from "@/components/home/TrustStrip";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <Hero />
      <TrustStrip />
      <ServicesStickySection />
      <HomeSections />
      <Footer />
    </main>
  );
}
