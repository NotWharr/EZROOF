import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/design/Hero";
import Footer from "@/components/layout/Footer";
import HomeSections from "@/components/home/HomeSections";
import ServicesStickySection from "@/components/home/ServicesStickySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-orange-600 selection:text-white">
      {/* Sticky Adaptive Navbar */}
      <NavBar />

      {/* Hero Section */}
      <Hero />
      <ServicesStickySection />
      <HomeSections />
      
      
      {/* Footer */}
      <Footer />
    </main>
  );
}