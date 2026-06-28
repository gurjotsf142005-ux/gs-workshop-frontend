import { motion } from "framer-motion";
import { useTilt, stagger, wordReveal, reveal } from "../lib/hooks";

import "../styles/royal-ledger.css";

function cloudinaryHero(url, width = 900) {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},c_fill,q_auto,f_auto/`);
}

export default function Hero({ settings }) {
  const cfg = settings || {};
  const headline = (cfg.heroHeadline || "I build modern web experiences that feel premium.").split(" ");
  const imageSrc = cloudinaryHero(cfg.heroImage || null, 900);
  const miniCards = Array.isArray(cfg.heroMiniCards) ? cfg.heroMiniCards : [];
  const techStack = Array.isArray(cfg.techStack) ? cfg.techStack : [];
  const tiltRef = useTilt(6);

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
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={cfg.heroImageAlt || "Gurjot Singh"}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <div className="hero-photo-placeholder">Add photo in Settings</div>
            )}

            <div className="pm-hero-badge">
              <span>{cfg.heroBadge || "Available for freelance & full-time roles"}</span>
              <strong>{cfg.heroBrand || "GS WorkShope"}</strong>
            </div>
          </div>
        </div>

        {techStack.length > 0 && (
          <div className="hero-right-bottom hero-chips-fadein">
            {techStack.map(function (t) {
              return (
                <span className="tech-chip pm-chip" key={t}>
                  {t}
                </span>
              );
            })}
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
          {headline.map(function (word, i) {
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
          {cfg.heroDescription ||
            "I help founders, businesses, and hiring teams turn ideas into fast, polished web products."}
        </motion.p>

        <motion.div
          className="hero-btns"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ delay: 0.4 }}
        >
          <a className="btn-fill" href="#projects">
            {cfg.heroPrimaryCta || "View Projects"}
          </a>
          <a className="btn-ghost pm-gold" href="#contact">
            {cfg.heroSecondaryCta || "Let's Talk"} →
          </a>
        </motion.div>

        {miniCards.length > 0 && (
          <motion.div
            className="hero-mini-cards"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {miniCards.map(function (card) {
              return (
                <motion.div key={card.label} className="mini-card" variants={reveal}>
                  <div className="mini-card-label">{card.label}</div>
                  <div className="mini-card-val">{card.value}</div>
                  <div className="mini-card-sub">{card.sub}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}