import { Camera, GitBranch, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal, reveal, revealRight } from "../lib/hooks";
import "../styles/royal-ledger.css";


export default function Contact({ settings = {} }) {
  const items = [
    { label: "Name",      value: settings.contactName      || "Gurjot Singh",        Icon: User },
    { label: "Email",     value: settings.contactEmail     || "your@email.com",       Icon: Mail },
    { label: "Instagram", value: settings.contactInstagram || "@yourhandle",          Icon: Camera },
    { label: "GitHub",    value: settings.contactGithub    || "github.com/gurjot",    Icon: GitBranch },
  ];
  const headingRef = useScrollReveal();

  return (
    <section className="contact" id="contact">
      <div className="contact-bg-text">Let's build</div>
      <div className="contact-inner">
        <div>
          <motion.p className="contact-eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            {settings.contactEyebrow || "Get in touch"}
          </motion.p>
          <h3 className="contact-h pm-underline" ref={headingRef}>
            {settings.contactHeadline || "Let's build something excellent together."}
          </h3>
          <motion.p className="contact-p" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            {settings.contactDescription || "Open to freelance projects, long-term collaborations, and interesting ideas."}
          </motion.p>
        </div>

        <motion.div className="contact-right" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealRight}>
          <div className="contact-info">
            {items.map(({ label, value, Icon }) => (
              <div className="ci-item" key={label}>
                <Icon className="ci-icon" size={16} />
                <span className="ci-label">{label}</span>
                <span className="ci-val">{value}</span>
              </div>
            ))}
          </div>
          <a className="btn-cream" href={`mailto:${settings.contactEmail || "your@email.com"}`}>
            {settings.contactButtonText || "Send a Message"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
