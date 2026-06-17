import { motion } from "framer-motion";
import { reveal, stagger, wordReveal, revealRight } from "../utils/motion";
import { useTilt } from "../utils/premiumMotion";

export default function Hero({ settings = {} }) {
  const headline  = (settings.heroHeadline || "I build modern web experiences that feel premium.").split(" ");
  const imageSrc  = settings.heroImage || null;
  const miniCards = Array.isArray(settings.heroMiniCards) ? settings.heroMiniCards : [];
  const techStack = Array.isArray(settings.techStack) ? settings.techStack : [];
  const tiltRef   = useTilt(6);

  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <motion.div className="hero-eyebrow" initial="hidden" animate="visible" variants={reveal}>
          <span className="h-line" />
          {settings.heroEyebrow || "Full-Stack Developer - MERN Stack"}
        </motion.div>

        <motion.h1 className="hero-h1" variants={stagger} initial="hidden" animate="visible">
          {headline.map((word, i) => {
            const isLast = i === headline.length - 1;
            return (
              <motion.span
                key={word + i}
                className={`word ${isLast ? "pm-italic-word" : ""}`}
                variants={wordReveal}
              >
                {word}
                {(i === 2 || i === 4) && <br />}
              </motion.span>
            );
          })}
        </motion.h1>

        <motion.p className="hero-p" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.3 }}>
          {settings.heroDescription || "I help founders, businesses, and hiring teams turn ideas into fast, polished web products."}
        </motion.p>

        <motion.div className="hero-btns" initial="hidden" animate="visible" variants={reveal} transition={{ delay: 0.4 }}>
          <a className="btn-fill" href="#projects">{settings.heroPrimaryCta || "View Projects"}</a>
          <a className="btn-ghost pm-gold" href="#contact">{settings.heroSecondaryCta || "Let's Talk"} →</a>
        </motion.div>

        {miniCards.length > 0 && (
          <motion.div className="hero-mini-cards" initial="hidden" animate="visible" variants={stagger}>
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

      <div className="hero-right">
        <motion.div
          className="hero-photo-wrap"
          style={{ position: "relative" }}
          initial="hidden"
          animate="visible"
          variants={revealRight}
        >
          <span className="pm-hero-orbit" aria-hidden="true" />
          <div className="pm-hero-frame" ref={tiltRef}>
            {imageSrc
              ? <img src={imageSrc} alt={settings.heroImageAlt || "Gurjot Singh"} fetchPriority="high" />
              : <div className="hero-photo-placeholder">📷 Add photo in Settings → Hero</div>
            }
            <div className="pm-hero-badge">
              <span>{settings.heroBadge || "Available for freelance & full-time roles"}</span>
              <strong>{settings.heroBrand || "GS WorkShope"}</strong>
            </div>
          </div>
        </motion.div>

        {techStack.length > 0 && (
          <motion.div className="hero-right-bottom"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}>
            {techStack.map((t) => <span className="tech-chip pm-chip" key={t}>{t}</span>)}
          </motion.div>
        )}
      </div>
    </section>
  );
}
