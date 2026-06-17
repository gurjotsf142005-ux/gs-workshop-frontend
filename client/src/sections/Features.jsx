import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { services as defaultServices } from "../data/siteData";
import { reveal, stagger } from "../utils/motion";
import { useScrollReveal } from "../utils/premiumMotion";

export default function Features({ settings = {} }) {
  const visibleServices = Array.isArray(settings.services) && settings.services.length
    ? settings.services
    : defaultServices;
  const headingRef = useScrollReveal();

  return (
    <section className="features" id="services">
      <div className="feat-top">
        <div>
          <motion.p className="feat-eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            {settings.servicesEyebrow || "What I offer"}
          </motion.p>
          <h2 className="feat-h2 pm-underline" ref={headingRef}>
            {settings.servicesHeadline || "Crafting products that feel effortless to use."}
          </h2>
        </div>
        <motion.div className="feat-right" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          <p className="feat-p">
            {settings.servicesDescription || "Architecture that's clean today and maintainable tomorrow."}
          </p>
          <a className="btn-arrow" href={settings.servicesCtaUrl || "#contact"}>
            {settings.servicesCta || "Download Resume"} <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>

      <motion.div className="feat-cards"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        {visibleServices.map(({ number, title, text, imageURL, Icon }, i) => {
          const FallbackIcon = defaultServices[i % defaultServices.length]?.Icon;
          return (
            <motion.article className="feat-card feature-card" key={`${title}-${i}`} variants={reveal}>
              <div className="fc-num pm-num">{number}</div>
              {imageURL
                ? <img className="fc-image" src={imageURL} alt={title} />
                : FallbackIcon
                  ? <div className="fc-icon"><FallbackIcon size={19} /></div>
                  : null
              }
              <div className="fc-title">{title}</div>
              <div className="fc-text">{text}</div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
