import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LenisContext } from "./hooks/useLenis";
import { useReducedMotion } from "./hooks/useReducedMotion";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Basics from "./components/Basics";
import Owner from "./components/Owner";
import Dialog from "./components/Dialog";
import Tabs from "./components/Tabs";
import Numbers from "./components/Numbers";
import Video from "./components/Video";
import Gallery from "./components/Gallery";
import Process from "./components/Process";
import Areas from "./components/Areas";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [ready, setReady] = useState(false); // true once intro lands / is skipped
  const reduceMotion = useReducedMotion();
  const refreshTimer = useRef(0);

  // Lenis drives scroll; GSAP's ticker drives Lenis so ScrollTrigger
  // stays perfectly in sync. Locked until the intro releases it.
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.1 });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    instance.stop();
    setLenis(instance);
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
    };
  }, []);

  // Reduced motion: no intro, so release scroll and reveal at once.
  useEffect(() => {
    if (!reduceMotion || !lenis) return;
    lenis.start();
    setReady(true);
  }, [reduceMotion, lenis]);

  // Anchor links glide with Lenis instead of jumping.
  useEffect(() => {
    function onClick(event: globalThis.MouseEvent) {
      const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor || !lenis) return;
      const target = document.querySelector(anchor.getAttribute("href") ?? "");
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  // One refresh after fonts + images settle; debounced on resize.
  useEffect(() => {
    function imagesReady(): Promise<unknown[]> {
      return Promise.all(
        Array.from(document.images).map((img) =>
          img.complete
            ? null
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }),
        ),
      );
    }
    Promise.all([document.fonts.ready, imagesReady()]).then(() => {
      ScrollTrigger.refresh();
    });
    function onResize() {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={() => {
          // Lenis is locked during the intro; skip link still works after.
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <div className="film-grain" aria-hidden="true" />
      {!reduceMotion ? <Preloader onDone={() => setReady(true)} /> : null}
      <Nav started={ready || reduceMotion} />
      <main id="main-content" className="relative z-10 min-h-screen bg-ink text-paper">
        <Hero started={ready || reduceMotion} />
        <Basics />
        <Owner />
        <Dialog />
        <Tabs />
        <Numbers />
        <Video />
        <Gallery />
        <Process />
        <Areas />
        <Faq />
        <Footer />
      </main>
    </LenisContext.Provider>
  );
}
