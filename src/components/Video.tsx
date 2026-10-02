import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLenis } from "../hooks/useLenis";
import { VIDEO } from "../content";
import { MOTION } from "../lib/motion";
import videoFile from "../assets/how-we-work.mp4";
import videoPoster from "../assets/how-we-work-poster.webp";

gsap.registerPlugin(Flip, ScrollTrigger);

function fmt(s: number): string {
  const safe = !isFinite(s) || s < 0 ? 0 : s;
  return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
}

// Custom player: scrub bar with buffered + tooltip, volume memory,
// toasts, shortcuts, spinner, and Flip fullscreen that never moves
// the video element, so playback never glitches.
export default function Video() {
  const rootRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef<HTMLSpanElement>(null);
  const bufferedRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const volRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const fullBtnRef = useRef<HTMLButtonElement>(null);
  const seekingRef = useRef(false);

  function fmtTime(s: number): string {
    return fmt(s);
  }

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [fsOpen, setFsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  const savedVolume = useRef(0.8);
  const userInteracted = useRef(false);
  const toastTimer = useRef(0);
  const opener = useRef<Element | null>(null);

  const showToast = useCallback((text: string) => {
    const toast = toastRef.current;
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => toast.classList.remove("is-on"), 1200);
  }, []);

  const paintProgress = useCallback(() => {
    const video = videoRef.current;
    const scrub = scrubRef.current;
    if (!video || !scrub) return;
    const dur = video.duration || 0;
    const ratio = dur ? video.currentTime / dur : 0;
    gsap.set(playedRef.current, { scaleX: ratio });
    if (handleRef.current) handleRef.current.style.left = `${ratio * 100}%`;
    if (dur && video.buffered.length) {
      gsap.set(bufferedRef.current, { scaleX: Math.min(video.buffered.end(video.buffered.length - 1) / dur, 1) });
    }
    if (timeRef.current) {
      const label = `${fmt(video.currentTime)} / ${fmt(dur)}`;
      if (timeRef.current.textContent !== label) timeRef.current.textContent = label;
    }
    scrub.setAttribute("aria-valuenow", String(Math.round(video.currentTime)));
    scrub.setAttribute("aria-valuetext", `${fmt(video.currentTime)} of ${fmt(dur)}`);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.error) return;
    if (video.ended) video.currentTime = 0;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }, []);

  // Transport wiring: events, rAF readout, autoplay rules.
  useEffect(() => {
    const video = videoRef.current;
    const player = playerRef.current;
    if (!video || !player) return;
    video.muted = true;
    video.volume = 0.8;
    let raf = 0;
    let idle = 0;
    const showBar = () => {
      player.classList.remove("is-idle");
      window.clearTimeout(idle);
    };
    const armIdle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!video.paused && !video.ended) player.classList.add("is-idle");
      }, 2500);
    };
    const loop = () => {
      paintProgress();
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(raf);
      loop();
      armIdle();
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(raf);
      paintProgress();
      showBar();
    };
    const onMeta = () => {
      scrubRef.current?.setAttribute("aria-valuemax", String(Math.round(video.duration || 0)));
      paintProgress();
    };
    const onWaiting = () => spinnerRef.current?.classList.add("is-on");
    const onCalm = () => spinnerRef.current?.classList.remove("is-on");
    const onError = () => {
      spinnerRef.current?.classList.remove("is-on");
      setFailed(true);
    };
    const onMove = () => {
      showBar();
      if (!video.paused && !video.ended) armIdle();
    };
    const markTouched = () => {
      userInteracted.current = true;
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onWaiting);
    video.addEventListener("playing", onCalm);
    video.addEventListener("canplay", onCalm);
    video.addEventListener("error", onError);
    player.addEventListener("mousemove", onMove);
    player.addEventListener("focusin", showBar);
    window.addEventListener("pointerdown", markTouched, { once: true });
    window.addEventListener("keydown", markTouched, { once: true });

    // Autoplay muted only if the user never interacted; always rest off-screen.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) video.pause();
        else if (!reduceMotion && !userInteracted.current && video.paused && !video.error) {
          void video.play().catch(() => {});
        }
      },
      { threshold: 0.5 },
    );
    io.observe(player);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onWaiting);
      video.removeEventListener("playing", onCalm);
      video.removeEventListener("canplay", onCalm);
      video.removeEventListener("error", onError);
      player.removeEventListener("mousemove", onMove);
      player.removeEventListener("focusin", showBar);
    };
  }, [paintProgress, reduceMotion]);

  // Mute + volume memory.
  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = savedVolume.current;
      showToast("Unmuted");
    } else {
      savedVolume.current = video.volume;
      video.muted = true;
      showToast("Muted");
    }
    setMuted(video.muted || video.volume === 0);
  }

  // Keyboard shortcuts when the player owns focus (not its controls,
  // which keep native Space/arrow behavior to avoid double-firing).
  function onPlayerKey(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".vid-scrub")) return;
    if (target.closest("button, input, a") && [" ", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      return;
    }
    const k = e.key;
    const handled =
      [" ", "k", "m", "f", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k) || /^[0-9]$/.test(k);
    if (!handled) return;
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;
    if (k === " " || k === "k") {
      togglePlay();
      showToast(video.paused ? "Paused" : "Playing");
    } else if (k === "m") {
      toggleMute();
    } else if (k === "f") {
      setFsOpen((v) => !v);
    } else if (k === "ArrowLeft") {
      video.currentTime -= 5;
      showToast("-5s");
    } else if (k === "ArrowRight") {
      video.currentTime += 5;
      showToast("+5s");
    } else if (k === "ArrowUp") {
      video.volume = Math.min(video.volume + 0.1, 1);
      video.muted = false;
      setMuted(false);
    } else if (k === "ArrowDown") {
      video.volume = Math.max(video.volume - 0.1, 0);
      setMuted(video.muted || video.volume === 0);
    } else if (/^[0-9]$/.test(k) && video.duration) {
      video.currentTime = (Number(k) / 10) * video.duration;
      showToast(`${Number(k) * 10}%`);
    }
    paintProgress();
  }

  // Flip fullscreen: placeholder holds layout, video never moves.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (!fsOpen) return;
    opener.current =
      document.activeElement && document.activeElement !== document.body
        ? document.activeElement
        : fullBtnRef.current;
    const placeholder = document.createElement("div");
    placeholder.className = "vid-placeholder";
    placeholder.style.width = `${player.offsetWidth}px`;
    placeholder.style.height = `${player.offsetHeight}px`;
    player.before(placeholder);
    lenis?.stop();
    player.classList.add("is-full");

    function onTrapKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setFsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(
        player!.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onTrapKey);

    function finishClose() {
      lenis?.start();
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ScrollTrigger optional here */
      }
      if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true });
    }

    if (reduceMotion) {
      gsap.set(player, { clearProps: "transform,borderRadius" });
    } else {
      const state = Flip.getState(player);
      gsap.set(player, { clearProps: "transform,borderRadius" });
      Flip.from(state, {
        duration: 0.8,
        ease: "expo.inOut",
        absolute: true,
        onComplete: () => {
          try {
            const req = (player as HTMLElement & { requestFullscreen?: () => Promise<void> }).requestFullscreen?.();
            void req?.catch(() => {});
          } catch {
            /* CSS fullscreen already covers us */
          }
        },
      });
    }

    function onNativeFs() {
      if (!document.fullscreenElement) setFsOpen(false);
    }
    document.addEventListener("fullscreenchange", onNativeFs);

    return () => {
      document.removeEventListener("keydown", onTrapKey);
      document.removeEventListener("fullscreenchange", onNativeFs);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      // Fly back to the placeholder, then remove it and restore.
      const back = Flip.getState(player);
      player.classList.remove("is-full");
      const done = () => {
        placeholder.remove();
        finishClose();
      };
      if (reduceMotion) {
        done();
      } else {
        Flip.from(back, {
          duration: 0.8,
          ease: "expo.inOut",
          absolute: true,
          onComplete: done,
        });
      }
    };
  }, [fsOpen, lenis, reduceMotion]);

  // Pinned scrub entrance on desktop with motion.
  useEffect(() => {
    const root = rootRef.current;
    const player = playerRef.current;
    if (!root || !player || reduceMotion) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("#how-we-work .rise").forEach((el) => {
          gsap.fromTo(
            el,
            { y: MOTION.RISE_Y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION.RISE_DURATION,
              ease: MOTION.EASE_OUT,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });
      }, root);
      return () => ctx.revert();
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root, // element ref: context scoping would hide our own id
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: MOTION.SCRUB,
          onToggle: (self) => gsap.set(player, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });
      tl.fromTo(
        player,
        { scale: 0.7, borderRadius: 28 },
        { scale: 1, borderRadius: 16, duration: 1, ease: MOTION.EASE_NONE },
      ).fromTo(
        ".vid-head",
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0.55, duration: 1, ease: MOTION.EASE_NONE },
        "<",
      );
    }, root);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section id="how-we-work" ref={rootRef} aria-label="How we work video" className="relative border-t border-line">
      <div className="wrap mx-auto w-[min(72rem,100%-2rem)] py-16 lg:py-24">
        <div className="vid-head rise pb-10">
          <p className="eyebrow font-mono text-micro uppercase tracking-[0.18em] text-accent">{VIDEO.eyebrow}</p>
          <h2 className="section-title font-display mt-4 max-w-[22ch] text-h2 font-bold leading-[1.05] tracking-tight">
            {VIDEO.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-muted">{VIDEO.sub}</p>
        </div>
        <div className="vid-stage pt-0">
          <div
            ref={playerRef}
            role="region"
            aria-label="Video player"
            tabIndex={0}
            onKeyDown={onPlayerKey}
            className="vid-player relative aspect-video overflow-hidden rounded-2xl border border-line bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <video
              ref={videoRef}
              className="vid-el block h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              poster={videoPoster}
              src={videoFile}
            />
            <div ref={spinnerRef} className="vid-spinner absolute inset-0 hidden items-center justify-center" aria-hidden="true">
              <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/20 border-t-accent" />
            </div>
            {!playing && !failed ? (
              <button
                type="button"
                className="vid-big absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-ink"
                aria-label="Play video"
                onClick={togglePlay}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-8 w-8 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : null}
            {failed ? (
              <p className="vid-error absolute right-4 bottom-22 left-4 rounded-xl border border-line bg-black/70 px-4 py-3 text-center text-sm">
                {VIDEO.unavailable}
              </p>
            ) : null}
            <div ref={toastRef} className="vid-toast pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-black/70 px-4 py-1.5 text-sm font-semibold opacity-0 transition-opacity" aria-hidden="true" />
            <div className="vid-bar absolute right-3 bottom-3 left-3 flex items-center gap-2.5 rounded-xl border border-line bg-black/65 p-2 px-3">
              <button
                type="button"
                className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-paper hover:bg-white/10"
                aria-label={playing ? "Pause" : "Play"}
                onClick={togglePlay}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div
                ref={scrubRef}
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={0}
                aria-valuenow={0}
                aria-valuetext="0:00 of 0:00"
                onPointerDown={(e) => {
                  const scrub = scrubRef.current;
                  const video = videoRef.current;
                  if (!scrub || !video?.duration) return;
                  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  seekingRef.current = true;
                  const box = scrub.getBoundingClientRect();
                  video.currentTime = gsap.utils.clamp(0, 1, (e.clientX - box.left) / box.width) * video.duration;
                  paintProgress();
                }}
                onPointerMove={(e) => {
                  const scrub = scrubRef.current;
                  const video = videoRef.current;
                  if (!scrub || !video?.duration || !tooltipRef.current || !hoverRef.current) return;
                  const box = scrub.getBoundingClientRect();
                  const x = e.clientX - box.left;
                  const ratio = gsap.utils.clamp(0, 1, x / box.width);
                  tooltipRef.current.style.left = `${x}px`;
                  hoverRef.current.style.left = "0";
                  hoverRef.current.style.width = `${x}px`;
                  tooltipRef.current.textContent = fmtTime(ratio * video.duration);
                  tooltipRef.current.classList.add("is-on");
                  if (seekingRef.current) {
                    video.currentTime = ratio * video.duration;
                    paintProgress();
                  }
                }}
                onPointerUp={() => {
                  seekingRef.current = false;
                  tooltipRef.current?.classList.remove("is-on");
                }}
                onPointerCancel={() => {
                  seekingRef.current = false;
                  tooltipRef.current?.classList.remove("is-on");
                }}
                onPointerLeave={() => tooltipRef.current?.classList.remove("is-on")}
                onKeyDown={(e) => {
                  const video = videoRef.current;
                  if (!video?.duration) return;
                  if (e.key === "ArrowRight") video.currentTime += 5;
                  else if (e.key === "ArrowLeft") video.currentTime -= 5;
                  else if (e.key === "Home") video.currentTime = 0;
                  else if (e.key === "End") video.currentTime = video.duration;
                  else return;
                  e.preventDefault();
                  paintProgress();
                }}
                className="vid-scrub relative flex h-6 flex-1 cursor-pointer touch-none items-center focus-visible:rounded focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="vid-track absolute right-0 left-0 h-1 rounded bg-white/20" />
                <span ref={bufferedRef} className="vid-buffered absolute right-0 left-0 h-1 origin-left scale-x-0 rounded bg-white/35" />
                <span ref={hoverRef} className="vid-hover absolute h-1 rounded bg-accent/35 opacity-0" style={{ left: 0, width: 0 }} />
                <span ref={playedRef} className="vid-played absolute right-0 left-0 h-1 origin-left scale-x-0 rounded bg-accent" />
                <span ref={handleRef} className="vid-handle absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ boxShadow: "var(--shadow-knob)" }} />
                <span ref={tooltipRef} className="vid-tip pointer-events-none absolute bottom-6 -translate-x-1/2 rounded-md border border-line bg-black/85 px-2 py-0.5 font-mono text-xs whitespace-nowrap opacity-0" />
              </div>
              <span ref={timeRef} className="font-mono text-micro whitespace-nowrap text-muted">
                0:00 / 0:00
              </span>
              <button
                type="button"
                className="vid-mute flex h-11 w-11 flex-none items-center justify-center rounded-lg text-paper hover:bg-white/10"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = savedVolume.current;
                  } else {
                    savedVolume.current = video.volume;
                    video.muted = true;
                  }
                  setMuted(video.muted || video.volume === 0);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                  <path d="M4 9v6h4l5 5V4L8 9H4z" />
                  {muted ? (
                    <path d="M16 9l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  ) : (
                    <path d="M16 8a5 5 0 010 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  )}
                </svg>
              </button>
              <input
                ref={volRef}
                type="range"
                min={0}
                max={100}
                defaultValue={80}
                aria-label="Volume"
                onInput={(e) => {
                  const video = videoRef.current;
                  const value = Number((e.target as HTMLInputElement).value);
                  if (!video) return;
                  video.volume = value / 100;
                  video.muted = value === 0;
                  if (value > 0) savedVolume.current = video.volume;
                  setMuted(video.muted || video.volume === 0);
                }}
                className="vid-vol w-0 cursor-pointer opacity-0 transition-all focus-visible:opacity-100"
              />
              <button
                ref={fullBtnRef}
                type="button"
                aria-label={fsOpen ? "Exit fullscreen" : "Fullscreen"}
                onClick={() => setFsOpen((v) => !v)}
                className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-paper hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
