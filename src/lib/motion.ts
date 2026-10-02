// One animation family for the whole site. GSAP scrubbed timelines
// use EASE_NONE (scrub owns pacing); Motion entrances use EASE_OUT.

export const MOTION = {
  EASE_OUT: "power3.out",
  EASE_NONE: "none",
  EASE_SNAP: "power2.out",
  SCRUB: 0.8,
  RISE_Y: 40,
  RISE_DURATION: 0.9,
  RISE_STAGGER: 0.08,
} as const;
