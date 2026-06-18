// hooks.js — shared animation hooks & Framer Motion variants
// Place at:  src/lib/hooks.js  (or wherever your shared utils live)
// Import in each component:
//   import { useTilt, useScrollReveal, reveal, revealRight, stagger, wordReveal } from "../lib/hooks";

import { useRef, useEffect } from "react";

/* ── useTilt ────────────────────────────────────────────────────────────────
   Attaches a mousemove listener to the returned ref and applies a 3-D
   perspective tilt via inline style.  Pass a max-degrees value (default 8).
   Works with any DOM element; Framer Motion transforms are not involved so
   the two systems don't conflict.
   Adds/removes `.is-tilting` on the element so the CSS float animation
   can pause while the mouse is actively tilting the card. */
export function useTilt(maxDeg = 8) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.classList.add("is-tilting");
      el.style.transform =
        `perspective(900px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg * 2}deg)`;
    }

    function onLeave() {
      el.classList.remove("is-tilting");
      el.style.transform = "";   // let CSS animation take over again
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxDeg]);

  return ref;
}

/* ── useScrollReveal ────────────────────────────────────────────────────────
   Returns a ref that, once the element enters the viewport, adds the CSS
   class "is-visible" (which you can hook into with a CSS transition/animation
   if you want a CSS-driven reveal in addition to Framer Motion variants).
   The hook is safe to call even when the browser lacks IntersectionObserver
   (it just does nothing). */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.unobserve(el);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}

/* ── Framer Motion variants ─────────────────────────────────────────────────
   These are plain objects — no React involved — so they're safe to import
   anywhere and reuse across components without re-creating on every render. */

/** Single element fade-up reveal */
export const reveal = {
  hidden:  { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Slide in from the right */
export const revealRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Container that staggers its children */
export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** Per-word reveal used in the Hero h1 */
export const wordReveal = {
  hidden:  { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};