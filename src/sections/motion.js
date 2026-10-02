/* ============================================================
   SHARED MOTION TOKENS (one animation family for every section)
   Import MOTION instead of inventing new eases or durations.
   Anything deliberately different (pill overshoot, modal snap,
   count-up landing) keeps a local const with a comment saying why.
   ============================================================ */

export const MOTION = {
  EASE_OUT: "power3.out",  // entrances, reveals, settles
  EASE_NONE: "none",       // scrubbed timelines (scrub owns pacing)
  EASE_SNAP: "power2.out", // short snappy modal/dialog beats
  SCRUB: 0.8,              // pin smoothing: higher = floatier
  RISE_Y: 40,              // fade-up travel distance (px)
  RISE_DURATION: 0.9,      // fade-up duration (seconds)
  RISE_STAGGER: 0.08,      // fade-up gap between siblings
};
