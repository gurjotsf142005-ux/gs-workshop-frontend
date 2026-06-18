import { useEffect, useRef } from "react";

export function useScrollReveal(options) {
  var opts = options || {};
  var ref = useRef(null);

  useEffect(function() {
    var el = ref.current;
    if (!el) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.classList.add("is-revealed");
      return;
    }

    var observer = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting) {
          el.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      Object.assign({ threshold: 0.25, rootMargin: "0px 0px -40px 0px" }, opts)
    );
    observer.observe(el);
    return function() { observer.disconnect(); };
  }, []);

  return ref;
}

/* ════════════════════════════════════════════════════════════════
   useTilt — desktop and touch now produce the SAME continuous,
   "always alive" feel.

   Desktop: unchanged. pointermove drives rotateX/rotateY live,
   resets on pointerleave.

   Touch (the part that used to be the problem): instead of a
   one-shot "settle" wobble that fired once via IntersectionObserver
   and then stopped forever (io.disconnect() right after), this now
   runs a continuous idle drift loop the entire time the element is
   in view — a slow sine-wave tilt that never stops, which is the
   touch-device equivalent of "the mouse is always capable of moving
   over this on desktop." On top of that:
     - if the device exposes gyroscope data (Android automatically,
       iOS only after a permission prompt triggered by a tap), real
       device-tilt takes over and drives the same transform live
     - dragging a finger across the element still overrides both and
       gives direct 1:1 control, same as before

   Net result: the photo / project cards never go fully static on
   mobile the way they did before — there's always some motion
   running while they're on screen, matching the desktop experience
   instead of a single wobble that played once per page load.
════════════════════════════════════════════════════════════════ */
export function useTilt(maxDeg) {
  var deg = maxDeg || 10;
  var ref = useRef(null);

  useEffect(function() {
    var el = ref.current;
    if (!el) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    var isTouch = window.matchMedia("(hover: none)").matches;
    var frame = null;

    function applyTilt(rotX, rotY, scale) {
      var s = scale || 1.03;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function() {
        el.style.transition = "transform 0.08s ease-out";
        el.style.transform =
          "perspective(900px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) scale3d(" + s + "," + s + "," + s + ")";
      });
    }

    function resetTilt() {
      if (frame) cancelAnimationFrame(frame);
      el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }

    // ── TOUCH / NO-HOVER DEVICES ─────────────────────────────────────
    if (isTouch) {
      var inView = false;
      var dragging = false;
      var orientationActive = false;
      var rafId = null;

      var io = new IntersectionObserver(function(entries) {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.15 });
      io.observe(el);

      function idleLoop(t) {
        if (inView && !dragging && !orientationActive) {
          var phase = t / 1800;
          var rotY = Math.sin(phase) * (deg * 0.55);
          var rotX = Math.cos(phase * 0.8) * (deg * 0.35);
          el.style.transition = "none";
          el.style.transform =
            "perspective(900px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) scale3d(1.015,1.015,1.015)";
        }
        rafId = requestAnimationFrame(idleLoop);
      }
      rafId = requestAnimationFrame(idleLoop);

      // Real device-tilt, when available, takes priority over the idle drift
      function onOrientation(e) {
        if (e.gamma === null || e.beta === null) return;
        orientationActive = true;
        var rotY = Math.max(-deg, Math.min(deg, e.gamma / 2));
        var rotX = Math.max(-deg, Math.min(deg, (e.beta - 45) / 2));
        applyTilt(rotX, -rotY, 1.02);
      }

      function enableOrientation() {
        if (typeof DeviceOrientationEvent === "undefined") return;
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          // iOS 13+: requires a user gesture. We try opportunistically on
          // the element's own first touch — if it's denied or unsupported,
          // the idle drift loop above already provides motion, so nothing
          // visually breaks either way.
          DeviceOrientationEvent.requestPermission()
            .then(function(state) {
              if (state === "granted") {
                window.addEventListener("deviceorientation", onOrientation);
              }
            })
            .catch(function() {});
        } else {
          window.addEventListener("deviceorientation", onOrientation);
        }
      }

      var askedOrientation = false;
      function onTouchStart() {
        dragging = true;
        el.style.transition = "none";
        if (!askedOrientation) {
          askedOrientation = true;
          enableOrientation();
        }
      }

      function onTouchMove(e) {
        if (!dragging) return;
        var t = e.touches[0];
        var rect = el.getBoundingClientRect();
        if (
          t.clientX < rect.left || t.clientX > rect.right ||
          t.clientY < rect.top  || t.clientY > rect.bottom
        ) {
          dragging = false;
          return;
        }
        var px = (t.clientX - rect.left) / rect.width;
        var py = (t.clientY - rect.top)  / rect.height;
        var tiltDeg = deg * 0.7;
        var rotY = (px - 0.5) * 2 * tiltDeg;
        var rotX = (0.5 - py) * 2 * tiltDeg;
        applyTilt(rotX, rotY, 1.03);
      }

      function onTouchEnd() {
        dragging = false;
      }

      el.addEventListener("touchstart",  onTouchStart,  { passive: true });
      el.addEventListener("touchmove",   onTouchMove,   { passive: true });
      el.addEventListener("touchend",    onTouchEnd);
      el.addEventListener("touchcancel", onTouchEnd);

      return function() {
        io.disconnect();
        if (rafId)  cancelAnimationFrame(rafId);
        if (frame)  cancelAnimationFrame(frame);
        window.removeEventListener("deviceorientation", onOrientation);
        el.removeEventListener("touchstart",  onTouchStart);
        el.removeEventListener("touchmove",   onTouchMove);
        el.removeEventListener("touchend",    onTouchEnd);
        el.removeEventListener("touchcancel", onTouchEnd);
      };
    }

    // ── DESKTOP (unchanged) ──────────────────────────────────────────
    function onPointerMove(e) {
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top)  / rect.height;
      var rotY =  (px - 0.5) * 2 * deg;
      var rotX = -(py - 0.5) * 2 * deg;
      applyTilt(rotX, rotY, 1.02);
    }

    function onPointerLeave() { resetTilt(); }

    el.addEventListener("pointermove",  onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return function() {
      el.removeEventListener("pointermove",  onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}