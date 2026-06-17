import { motion } from "framer-motion";
import { aboutCards as defaultCards } from "../data/siteData";
import { reveal, revealRight } from "../utils/motion";
import { useScrollReveal } from "../utils/premiumMotion";

export default function About({ settings = {} }) {
  const cards = Array.isArray(settings.aboutCards) && settings.aboutCards.length
    ? settings.aboutCards
    : defaultCards;
  const headingRef = useScrollReveal();

  return (
    <section className="about" id="about">
      <div className="about-left">
        <motion.p className="about-eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          {settings.aboutEyebrow || "About Gurjot"}
        </motion.p>
        <h2 className="about-h pm-underline" ref={headingRef}>
          {settings.aboutHeadline || "Full-stack thinking with a product-first eye."}
        </h2>
        <motion.p className="about-p" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          {settings.aboutTextOne || "I'm Gurjot Singh, a full-stack developer focused on building modern web products."}
        </motion.p>
        <motion.p className="about-p2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          {settings.aboutTextTwo || "Through GS WorkShope, I help clients and teams turn ideas into polished digital experiences."}
        </motion.p>
      </div>

      <motion.div className="about-right"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealRight}>
        {cards.map(({ title, subtitle, body, Icon, tags }, i) => {
          const CardIcon = Icon || defaultCards[i % defaultCards.length]?.Icon;
          return (
            <article className="about-card" key={`${title}-${i}`}>
              <div className="ac-top">
                {CardIcon && <div className="ac-icon"><CardIcon size={17} /></div>}
                <div>
                  <div className="ac-title">{title}</div>
                  <div className="ac-sub">{subtitle}</div>
                </div>
              </div>
              <div className="ac-body">{body}</div>
              {Array.isArray(tags) && tags.length > 0 && (
                <div className="ac-tags">
                  {tags.map((t) => <span className="actag" key={t}>{t}</span>)}
                </div>
              )}
            </article>
          );
        })}
      </motion.div>
    </section>
  );
}
