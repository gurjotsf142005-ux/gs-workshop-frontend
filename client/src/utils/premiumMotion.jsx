// src/utils/premiumMotion.js
//
// Two small hooks that pair with premium.css:
//
//   useScrollReveal()  -> ref to drop on any element with
//                          data-reveal="words" / "lines", or
//                          className="pm-underline" / "pm-stat".
//                          Adds .is-revealed the first time the
//                          element crosses the viewport, then stops
//                          observing (mirrors the once:true pattern
//                          you're already using with framer's
//                          whileInView).
//
//   useTilt(maxDeg)    -> ref to drop on the hero photo frame or a
//                          project card.
//                          Desktop/mouse: tracks pointer position and
//                          applies a perspective tilt + drop highlight
//                          via inline transform, resetting smoothly on
//                          pointer leave.
//                          Touch devices: there's no cursor to tilt
//                          toward, so instead it plays a one-time
//                          "settle" animation (brief tilt that eases
//                          flat) the first time the element scrolls
//                          into view — driven by the .pm-settle-ready /
//                          .pm-settle-play classes in premium.css.
//                          No-ops entirely when prefers-reduced-motion
//                          is set.
//
// Usage in a component:
//
//   import { useScrollReveal, useTilt } from "../utils/premiumMotion";
//
//   function ProjectCard({ p }) {
//     const tiltRef = useTilt(8);
//     return <article ref={tiltRef} className="project-card pm-tilt">...
//   }
//
//   function SectionHeading({ children }) {
//     const revealRef = useScrollReveal();
//     return <h2 ref={revealRef} className="feat-h2 pm-underline">{children}</h2>;
//   }

import { useEffect, useRef } from "react";

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function useTilt(maxDeg = 10) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const isTouch = window.matchMedia("(hover: none)").matches;

    // Touch devices have no cursor to tilt toward, so instead of doing
    // nothing, give the element a one-time "settle" animation as it
    // scrolls into view: a brief tilt that eases flat, driven by
    // .pm-settle in premium.css. This keeps phones feeling alive
    // without trying to fake hover on a finger.
    if (isTouch) {
      el.classList.add("pm-settle-ready");
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("pm-settle-play");
            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    let frame = null;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1

      const rotateY = (px - 0.5) * 2 * maxDeg;
      const rotateX = (0.5 - py) * 2 * maxDeg;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
      });
    }

    function handleLeave() {
      if (frame) cancelAnimationFrame(frame);
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxDeg]);

  return ref;
}