import { motion } from "framer-motion";
import { reveal, stagger, wordReveal } from "../utils/motion";
import { useTilt } from "../utils/premiumMotion";

export default function Hero({ settings }) {
  var cfg      = settings || {};
  var headline = (cfg.heroHeadline || "I build modern web experiences that feel premium.").split(" ");
  var imageSrc = cfg.heroImage || null;
  var miniCards = Array.isArray(cfg.heroMiniCards) ? cfg.heroMiniCards : [];
  var techStack = Array.isArray(cfg.techStack) ? cfg.techStack : [];
  var tiltRef  = useTilt(6);

  return (
    <section className="hero" id="home">

      {/* ── PHOTO — left column ─────────────────────────────────────
          NO Framer Motion here at all.
          Plain CSS fade-in so useTilt owns transform completely.
      ──────────────────────────────────────────────────────────────── */}
      <div className="hero-right">
        <div className="hero-photo-wrap" style={{ position: "relative" }}>
          <span className="pm-hero-orbit" aria-hidden="true" />

          {/* tiltRef here — useTilt is the ONLY thing touching transform */}
          <div
            className="pm-hero-frame hero-photo-fadein"
            ref={tiltRef}
            style={{ transformStyle: "preserve-3d" }}
          >
            {imageSrc
              ? <img src={imageSrc} alt={cfg.heroImageAlt || "Gurjot Singh"} fetchPriority="high" />
              : <div className="hero-photo-placeholder">Add photo in Settings</div>
            }
            <div className="pm-hero-badge">
              <span>{cfg.heroBadge || "Available for freelance & full-time roles"}</span>
              <strong>{cfg.heroBrand || "GS WorkShope"}</strong>
            </div>
          </div>
        </div>

        {techStack.length > 0 && (
          <div className="hero-right-bottom hero-chips-fadein">
            {techStack.map(function(t) {
              return <span className="tech-chip pm-chip" key={t}>{t}</span>;
            })}
          </div>
        )}
      </div>

      {/* ── TEXT — right column ─────────────────────────────────────── */}
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
          {headline.map(function(word, i) {
            var isLast = i === headline.length - 1;
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
          <a className="btn-fill" href="#projects">{cfg.heroPrimaryCta || "View Projects"}</a>
          <a className="btn-ghost pm-gold" href="#contact">{cfg.heroSecondaryCta || "Let's Talk"} →</a>
        </motion.div>

        {miniCards.length > 0 && (
          <motion.div
            className="hero-mini-cards"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {miniCards.map(function(card) {
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