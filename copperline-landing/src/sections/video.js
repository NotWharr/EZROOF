/* ============================================================
   HOW WE WORK VIDEO (custom player + scroll entrance)
   Scroll: pinned entrance scales the player 0.7 to 1 while the
   headline drifts up. Player: custom controls, scrub bar with
   buffered + tooltip, volume memory, toasts, shortcuts, and a
   Flip-powered fullscreen that never unmounts the video.

   Desktop (>=768px): pinned scrub entrance.
   Mobile (<768px):   fade-up reveal, no pin.
   Reduced motion:    no pin/scrub, instant fullscreen, no autoplay.
   ============================================================ */

import gsap from "gsap";
import Flip from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motion.js";
import videoSrc from "../assets/how-we-work.mp4";
import posterSrc from "../assets/how-we-work-poster.webp";

gsap.registerPlugin(Flip, ScrollTrigger);

/* ---------- EDIT YOUR COPY HERE ---------- */
const CONTENT = {
  eyebrow: "How we work",
  title: "Diagnosed on camera, fixed in one visit.",
  sub: "Watch a trap replacement, start to finish, in 10 seconds.",
  video: videoSrc,
  poster: posterSrc,
  unavailable: "Video unavailable - the poster says it all.",
};

/* Entrance + fullscreen tuning. Scrub is the shared family value. */
const ENTER_END = "+=120%";
const PLAYER_FROM = 0.7; // entrance scale: 70% width to full
const RADIUS_FROM = 28;   // entrance radius: chunky to card
const FS_DURATION = 0.8;  // fullscreen fly time
const FS_EASE = "expo.inOut";
const BAR_IDLE_MS = 2500; // control bar hides after this long playing

export function initVideo() {
  const root = document.getElementById("how-we-work");
  if (!root) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Render copy + media from CONTENT so edits stay in one place.
  root.querySelector(".vid-eyebrow").textContent = CONTENT.eyebrow;
  root.querySelector(".vid-title").textContent = CONTENT.title;
  root.querySelector(".vid-sub").textContent = CONTENT.sub;
  const player = root.querySelector(".vid-player");
  const video = root.querySelector(".vid-el");
  video.src = CONTENT.video;
  video.poster = CONTENT.poster;

  const bigBtn = root.querySelector(".vid-big");
  const playBtn = root.querySelector(".vid-play");
  const scrub = root.querySelector(".vid-scrub");
  const played = root.querySelector(".vid-played");
  const buffered = root.querySelector(".vid-buffered");
  const hoverMark = root.querySelector(".vid-hover");
  const tooltip = root.querySelector(".vid-tip");
  const handle = root.querySelector(".vid-handle");
  const timeEl = root.querySelector(".vid-time");
  const muteBtn = root.querySelector(".vid-mute");
  const volSlider = root.querySelector(".vid-vol");
  const fullBtn = root.querySelector(".vid-full");
  const spinner = root.querySelector(".vid-spinner");
  const toast = root.querySelector(".vid-toast");
  const errBox = root.querySelector(".vid-error");

  /* ---------- Small helpers ---------- */
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 1200);
  }

  /* ---------- Transport state ---------- */
  video.muted = true; // muted until the human says otherwise
  video.volume = 0.8;
  volSlider.value = 80;
  let savedVolume = 0.8; // session volume memory
  let userInteracted = false; // flips on first pointer/key press
  let rafId = 0;
  let idleTimer;
  let hovering = false;

  function isPlaying() {
    return !video.paused && !video.ended;
  }
  // Play/pause glyphs swap with state (two tiny inline SVGs).
  function paintTransport() {
    const playing = isPlaying();
    player.classList.toggle("is-playing", playing);
    bigBtn.setAttribute("aria-label", playing ? "Pause video" : "Play video");
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  }
  function togglePlay() {
    if (video.error) return;
    if (video.ended) video.currentTime = 0;
    if (video.paused) video.play().catch(() => {}); // autoplay blocks land here
    else video.pause();
  }

  /* ---------- Smooth scrub readout (rAF, not timeupdate) ---------- */
  function paintProgress() {
    const dur = video.duration || 0;
    const ratio = dur ? video.currentTime / dur : 0;
    gsap.set(played, { scaleX: ratio });
    gsap.set(handle, { left: `${ratio * 100}%` });
    if (dur && video.buffered.length) {
      const end = video.buffered.end(video.buffered.length - 1);
      gsap.set(buffered, { scaleX: Math.min(end / dur, 1) });
    }
    const label = `${fmt(video.currentTime)} / ${fmt(dur)}`;
    if (timeEl.textContent !== label) timeEl.textContent = label;
    const now = Math.round(video.currentTime);
    scrub.setAttribute("aria-valuenow", String(now));
    scrub.setAttribute("aria-valuetext", `${fmt(video.currentTime)} of ${fmt(dur)}`);
  }
  function loop() {
    paintProgress();
    rafId = requestAnimationFrame(loop);
  }
  video.addEventListener("play", () => {
    paintTransport();
    cancelAnimationFrame(rafId);
    loop();
    armIdleHide();
  });
  video.addEventListener("pause", () => {
    paintTransport();
    cancelAnimationFrame(rafId);
    paintProgress();
    showBar();
  });
  video.addEventListener("loadedmetadata", () => {
    scrub.setAttribute("aria-valuemax", String(Math.round(video.duration || 0)));
    paintProgress();
  });

  /* ---------- Buffering spinner ---------- */
  video.addEventListener("waiting", () => spinner.classList.add("is-on"));
  video.addEventListener("stalled", () => spinner.classList.add("is-on"));
  video.addEventListener("playing", () => spinner.classList.remove("is-on"));
  video.addEventListener("canplay", () => spinner.classList.remove("is-on"));

  /* ---------- Missing file: poster + message, no crash ---------- */
  video.addEventListener("error", () => {
    spinner.classList.remove("is-on");
    errBox.textContent = CONTENT.unavailable;
    errBox.hidden = false;
  });

  /* ---------- Autoplay rules: muted, uninteracted, visible only ---------- */
  window.addEventListener("pointerdown", () => (userInteracted = true), { once: true });
  window.addEventListener("keydown", () => (userInteracted = true), { once: true });
  new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (!visible) {
      video.pause(); // always rest when scrolled away
    } else if (!reduceMotion && !userInteracted && video.paused && !video.error) {
      video.play().catch(() => {}); // muted autoplay, policies may veto
    }
  }, { threshold: 0.5 }).observe(player);

  /* ---------- Control bar auto-hide ---------- */
  function showBar() {
    player.classList.remove("is-idle");
    clearTimeout(idleTimer);
  }
  function armIdleHide() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (isPlaying()) player.classList.add("is-idle");
    }, BAR_IDLE_MS);
  }
  player.addEventListener("mousemove", () => {
    showBar();
    if (isPlaying()) armIdleHide();
  });
  player.addEventListener("focusin", showBar);
  player.addEventListener("mouseenter", () => (hovering = true));
  player.addEventListener("mouseleave", () => (hovering = false));

  /* ---------- Click to play: big button, bar button, video ---------- */
  bigBtn.addEventListener("click", togglePlay);
  playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  /* ---------- Seek: drag + click + hover tooltip ---------- */
  function ratioAt(clientX) {
    const box = scrub.getBoundingClientRect();
    return gsap.utils.clamp(0, 1, (clientX - box.left) / box.width);
  }
  let seeking = false;
  scrub.addEventListener("pointerdown", (e) => {
    if (!video.duration) return;
    seeking = true;
    scrub.setPointerCapture(e.pointerId); // drag keeps reporting outside
    video.currentTime = ratioAt(e.clientX) * video.duration;
    paintProgress();
  });
  scrub.addEventListener("pointermove", (e) => {
    if (!video.duration) return;
    const ratio = ratioAt(e.clientX);
    // Tooltip + hover highlight follow the cursor.
    const box = scrub.getBoundingClientRect();
    const x = e.clientX - box.left;
    tooltip.style.left = `${x}px`;
    hoverMark.style.left = "0";
    hoverMark.style.width = `${x}px`;
    tooltip.textContent = fmt(ratio * video.duration);
    tooltip.classList.add("is-on");
    if (seeking) {
      video.currentTime = ratio * video.duration;
      paintProgress();
    }
  });
  const endSeek = () => {
    seeking = false;
    tooltip.classList.remove("is-on");
  };
  scrub.addEventListener("pointerup", endSeek);
  scrub.addEventListener("pointercancel", endSeek);
  scrub.addEventListener("mouseleave", () => tooltip.classList.remove("is-on"));
  scrub.addEventListener("keydown", (e) => {
    if (!video.duration) return;
    if (e.key === "ArrowRight") video.currentTime += 5;
    else if (e.key === "ArrowLeft") video.currentTime -= 5;
    else if (e.key === "Home") video.currentTime = 0;
    else if (e.key === "End") video.currentTime = video.duration;
    else return;
    e.preventDefault();
    paintProgress();
  });

  /* ---------- Volume: memory + expanding slider ---------- */
  function paintVolume() {
    muteBtn.classList.toggle("is-muted", video.muted || video.volume === 0);
    if (document.activeElement !== volSlider) volSlider.value = Math.round(video.volume * 100);
  }
  muteBtn.addEventListener("click", () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = savedVolume; // restore last session level
      showToast("Unmuted");
    } else {
      savedVolume = video.volume;
      video.muted = true;
      showToast("Muted");
    }
    paintVolume();
  });
  volSlider.addEventListener("input", () => {
    video.volume = volSlider.value / 100;
    video.muted = video.volume === 0;
    if (video.volume > 0) savedVolume = video.volume;
    paintVolume();
  });
  paintTransport();
  paintVolume();

  /* ---------- Keyboard shortcuts (focused or hovered only) ---------- */
  player.addEventListener("keydown", (e) => {
    const k = e.key;
    // The scrub strip owns its keys end to end; doubling them here
    // would seek twice per press.
    if (e.target.closest(".vid-scrub")) return;
    // Native controls handle their own keys: Space/Enter/arrows on a
    // focused button, link or slider must not ALSO fire shortcuts
    // (Space on Play would toggle twice and cancel itself out).
    if (
      e.target.closest("button, input, a") &&
      [" ", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k)
    ) {
      return;
    }
    const handled = [" ", "k", "m", "f", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k) || /^[0-9]$/.test(k);
    if (!handled) return;
    e.preventDefault(); // Space/arrows must not scroll the page
    if (k === " " || k === "k") {
      togglePlay();
      showToast(isPlaying() ? "Paused" : "Playing");
    } else if (k === "m") muteBtn.click();
    else if (k === "f") toggleFullscreen();
    else if (k === "ArrowLeft") {
      video.currentTime -= 5;
      showToast("-5s");
    } else if (k === "ArrowRight") {
      video.currentTime += 5;
      showToast("+5s");
    } else if (k === "ArrowUp") {
      video.volume = Math.min(video.volume + 0.1, 1);
      video.muted = false;
      paintVolume();
    } else if (k === "ArrowDown") {
      video.volume = Math.max(video.volume - 0.1, 0);
      paintVolume();
    } else if (/^[0-9]$/.test(k) && video.duration) {
      video.currentTime = (Number(k) / 10) * video.duration;
      showToast(`${Number(k) * 10}%`);
    }
    paintProgress();
  });

  /* ---------- Flip fullscreen: the video never moves ---------- */
  let fsOpen = false;
  let fsAnimating = false;
  let placeholder = null;
  let opener = null;

  function focusables() {
    return Array.from(
      player.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled && el.offsetParent !== null);
  }
  function onTrapKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeFullscreen();
      return;
    }
    if (e.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
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

  function openFullscreen() {
    if (fsOpen) return;
    // Prefer whoever had focus; Safari mouse clicks focus nothing,
    // so fall back to the fullscreen button itself.
    opener =
      document.activeElement && document.activeElement !== document.body
        ? document.activeElement
        : fullBtn;
    // A same-size stand-in holds the layout while fixed positioning
    // lifts the player out of flow. Nothing reflows, nothing jumps.
    placeholder = document.createElement("div");
    placeholder.className = "vid-placeholder";
    placeholder.style.width = `${player.offsetWidth}px`;
    placeholder.style.height = `${player.offsetHeight}px`;
    player.before(placeholder);

    fsOpen = true;
    fsAnimating = true;
    if (window.__lenis) window.__lenis.stop(); // freeze the page behind
    document.addEventListener("keydown", onTrapKey);
    showBar(); // controls stay visible in fullscreen

    if (reduceMotion) {
      player.classList.add("is-full");
      gsap.set(player, { clearProps: "transform,borderRadius" });
      fsAnimating = false;
      return;
    }
    // Capture the original box BEFORE the class changes it,
    // then fly from the old box to the fullscreen one.
    const state = Flip.getState(player);
    player.classList.add("is-full");
    gsap.set(player, { clearProps: "transform,borderRadius" });
    Flip.from(state, {
      duration: FS_DURATION,
      ease: FS_EASE,
      absolute: true,
      onComplete: () => {
        fsAnimating = false;
        // Optional native layer on top: if the browser refuses
        // (or iOS Safari), the CSS fullscreen already covers us.
        try {
          const req = player.requestFullscreen && player.requestFullscreen();
          if (req && req.catch) req.catch(() => {});
        } catch (_) {}
      },
    });
  }

  function closeFullscreen() {
    if (!fsOpen) return;
    // Mid-animation close: kill the flight, reverse from right here.
    gsap.killTweensOf(player);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    const land = () => {
      const state = Flip.getState(player);
      player.classList.remove("is-full");
      if (reduceMotion) {
        if (placeholder) placeholder.remove();
        placeholder = null;
        finishClose();
      } else {
        Flip.from(state, {
          duration: FS_DURATION,
          ease: FS_EASE,
          absolute: true,
          onComplete: () => {
            if (placeholder) placeholder.remove();
            placeholder = null;
            finishClose();
          },
        });
      }
    };
    const finishClose = () => {
      fsOpen = false;
      fsAnimating = false;
      document.removeEventListener("keydown", onTrapKey);
      if (window.__lenis) window.__lenis.start();
      ScrollTrigger.refresh(); // layout is whole again, re-measure pins
      if (opener) opener.focus({ preventScroll: true });
    };
    land();
  }

  function toggleFullscreen() {
    if (fsOpen) closeFullscreen();
    else openFullscreen();
  }
  fullBtn.addEventListener("click", toggleFullscreen);

  /* ---------- Scroll entrance ---------- */
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", () => {});
  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#how-we-work",
          start: "top top",
          end: ENTER_END,
          pin: true,
          scrub: MOTION.SCRUB,
          onToggle: (self) =>
            gsap.set(player, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });
      // Transform + radius only: no width animation anywhere.
      tl.fromTo(
        player,
        { scale: PLAYER_FROM, borderRadius: RADIUS_FROM },
        { scale: 1, borderRadius: 16, duration: 1, ease: "none" }
      ).fromTo(
        ".vid-head",
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0.55, duration: 1, ease: "none" },
        "<"
      );
    }
  );
  mm.add(
    "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.utils.toArray("#how-we-work .rise").forEach((el) => {
        gsap.fromTo(
          el,
          { y: MOTION.RISE_Y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION.RISE_DURATION,
            ease: MOTION.EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }
  );
}
