import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/royal-ledger.css";


export default function Navbar({ settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Build nav links from settings or fallback
  const navLinks = Array.isArray(settings.navLinks) && settings.navLinks.length
    ? settings.navLinks
    : [{ label: "About", href: "#about" }, { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" }];

  useEffect(() => {
    const close = () => { if (window.innerWidth > 760) setMenuOpen(false); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    // NOTE: the menu used to live OUTSIDE <nav> as a sibling. Since the CSS rule
    // for .gs-mobile-menu uses `position: absolute; top: 100%;`, it needs a
    // positioned ancestor that is exactly the navbar's own box — otherwise
    // `top: 100%` resolves against whatever wraps the whole page instead,
    // and the menu renders far off-screen. Moving it INSIDE <nav> (which already
    // has position: sticky from premium-royal.css) fixes that.
    <nav className="navbar">
      <a className="nav-logo" href="#home">
        {settings.navName || "Gurjot Singh"}
        <span>{settings.navBrand || "GS WorkShope"}</span>
      </a>

      <div className="nav-center gs-hide-mobile">
        {navLinks.map((l) => (
          <a key={l.label} href={l.href}>{l.label}</a>
        ))}
      </div>

      <div className="nav-right gs-hide-mobile">
        <div className="nav-avail">
          <span className="nav-dot-green" />
          {settings.navStatus || "Available for work"}
        </div>
        <a className="nav-cta" href="#contact">{settings.navCta || "Hire Me"}</a>
      </div>

      <button className="gs-burger" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} aria-label="Menu">
        <span className={menuOpen ? "line-1 open" : "line-1"} />
        <span className={menuOpen ? "line-2 open" : "line-2"} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="gs-mobile-menu"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}