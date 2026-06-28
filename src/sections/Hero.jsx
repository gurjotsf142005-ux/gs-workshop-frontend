import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTilt, stagger, wordReveal, reveal } from "../lib/hooks";

import "../styles/royal-ledger.css";

// Strip any existing transform then apply fresh ones.
// WHY: ImageUploadField stores URLs that may already have f_auto,q_auto,w_800.
// If we just do url.replace('/upload/', '/upload/w_900...') we get double
// transforms like /upload/f_auto,q_auto,w_800/upload/w_900,f_auto/ — Cloudinary
// errors or ignores the second block entirely, serving the wrong size.
function buildHeroUrl(url, width = 900) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_fill/`);
}

// Tiny 30px blurred version — loads in <1KB, arrives almost instantly.
// Gives the eye a colour-correct placeholder while the full image loads.
function buildBlurUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", "/upload/w_30,q_10,e_blur:400/");
}

export default function Hero({ settings }) {
  const cfg       = settings || {};
  const headline  = (cfg.heroHeadline || "I build modern web experiences that feel premium.").split(" ");
  const miniCards = Array.isArray(cfg.heroMiniCards) ? cfg.heroMiniCards : [];
  const techStack = Array.isArray(cfg.techStack)     ? cfg.techStack     : [];
  const tiltRef   = useTilt(6);

  const rawSrc  = cfg.heroImage || null;
  const heroSrc = buildHeroUrl(rawSrc, 900);
  const blurSrc = buildBlurUrl(rawSrc);

  const [blurReady, setBlurReady] = useState(false);
  const [mainReady, setMainReady] = useState(false);

  // Reset when settings change (admin saves a new photo)
  useEffect(() => {
    setBlurReady(false);
    setMainReady(false);
  }, [rawSrc]);

  return (
    <section className="hero" id="home">
      <div className="hero-right">
        <div className="hero-photo-wrap" style={{ position: "relative" }}>
          <span className="pm-hero-orbit" aria-hidden="true" />

          <div
            className="pm-hero-frame hero-photo-fadein"
            ref={tiltRef}
            style={{ transformStyle: "preserve-3d" }}
          >
            {rawSrc ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>

                {/* Skeleton — shows before blur loads */}
                {!blurReady && !mainReady && (
                  <div style={{
                    position:       "absolute",
                    inset:          0,
                    borderRadius:   "inherit",
                    background:     "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
                    backgroundSize: "200% 100%",
                    animation:      "shimmer 1.4s infinite",
                  }} />
                )}

                {/* Blur placeholder — tiny file, loads near-instantly */}
                <img
                  src={blurSrc}
                  alt=""
                  aria-hidden="true"
                  onLoad={() => setBlurReady(true)}
                  style={{
                    position:   "absolute",
                    inset:      0,
                    width:      "100%",
                    height:     "100%",
                    objectFit:  "cover",
                    borderRadius: "inherit",
                    filter:     "blur(16px)",
                    transform:  "scale(1.06)", // hide blur edge artifacts
                    opacity:    mainReady ? 0 : 1,
                    transition: "opacity 0.4s ease",
                    zIndex:     1,
                  }}
                />

                {/* Full hero image */}
                <img
                  src={heroSrc}
                  alt={cfg.heroImageAlt || "Gurjot Singh"}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onLoad={() => setMainReady(true)}
                  style={{
                    position:     "absolute",
                    inset:        0,
                    width:        "100%",
                    height:       "100%",
                    objectFit:    "cover",
                    borderRadius: "inherit",
                    opacity:      mainReady ? 1 : 0,
                    transition:   "opacity 0.4s ease",
                    zIndex:       2,
                  }}
                />
              </div>
            ) : (
              <div className="hero-photo-placeholder">Add photo in Settings</div>
            )}

            <div className="pm-hero-badge">
              <span>{cfg.heroBadge  || "Available for freelance & full-time roles"}</span>
              <strong>{cfg.heroBrand || "GS WorkShope"}</strong>
            </div>
          </div>
        </div>

        {techStack.length > 0 && (
          <div className="hero-right-bottom hero-chips-fadein">
            {techStack.map((t) => (
              <span className="tech-chip pm-chip" key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="hero-left">
        <motion.div
          className="hero-eyebrow"
          initial="hidden"
          animate="visible"
          variants={reveal}
        >
          <span className="h-line" />
          {cfg.heroEyebrow || "Full-Stack Developer - MERN Stack"}
        </motion.div>

        <motion.h1
          className="hero-h1"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {headline.map((word, i) => {
            const isLast = i === headline.length - 1;
            return (
              <motion.span
                key={word + i}
                className={"word" + (isLast ? " pm-italic-word" : "")}
                variants={wordReveal}
              >
                {word}
                {(i === 2 || i === 4) && <br />}
              </motion.span>
            );
          })}
        </motion.h1>

        <motion.p
          className="hero-p"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ delay: 0.3 }}
        >
          {cfg.heroDescription || "I help founders, businesses, and hiring teams turn ideas into fast, polished web products."}
        </motion.p>

        <motion.div
          className="hero-btns"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ delay: 0.4 }}
        >
          <a className="btn-fill"       href="#projects">{cfg.heroPrimaryCta  || "View Projects"}</a>
          <a className="btn-ghost pm-gold" href="#contact">{cfg.heroSecondaryCta || "Let's Talk"} →</a>
        </motion.div>

        {miniCards.length > 0 && (
          <motion.div
            className="hero-mini-cards"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {miniCards.map((card) => (
              <motion.div key={card.label} className="mini-card" variants={reveal}>
                <div className="mini-card-label">{card.label}</div>
                <div className="mini-card-val">{card.value}</div>
                <div className="mini-card-sub">{card.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}