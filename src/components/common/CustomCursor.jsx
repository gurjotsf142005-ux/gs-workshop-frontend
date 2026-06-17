import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [point, setPoint]     = useState({ x: -100, y: -100 });
  const [ring, setRing]       = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const pointRef = useRef(point);

  useEffect(() => { pointRef.current = point; }, [point]);

  useEffect(() => {
    let frame;

    const onMove = (e) => setPoint({ x: e.clientX, y: e.clientY });

    // Use event delegation instead of attaching to every element —
    // works for dynamically-rendered cards (projects, services, etc.)
    const onOver = (e) => {
      if (e.target.closest("a, button, .project-card, .about-card, .feature-card, .feat-card")) {
        setHovering(true);
      }
    };
    const onOut = (e) => {
      if (e.target.closest("a, button, .project-card, .about-card, .feature-card, .feat-card")) {
        setHovering(false);
      }
    };

    const animate = () => {
      setRing((cur) => ({
        x: cur.x + (pointRef.current.x - cur.x) * 0.14,
        y: cur.y + (pointRef.current.y - cur.y) * 0.14,
      }));
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" style={{ left: point.x, top: point.y }} />
      <span className={`cursor-ring ${hovering ? "is-hovering" : ""}`} style={{ left: ring.x, top: ring.y }} />
    </>
  );
}
