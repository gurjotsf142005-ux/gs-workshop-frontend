import { Camera, GitBranch, Mail, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal, reveal, revealRight } from "../lib/hooks";
import "../styles/royal-ledger.css";

// tel: links don't reliably support spaces/formatting across browsers
// and WebViews — strip everything except digits and a leading "+".
function cleanTel(phone) {
  if (!phone) return "0000000000";
  return phone.replace(/[^\d+]/g, "");
}

export default function Contact({ settings = {} }) {
  const phoneDisplay = settings.contactPhone || "+91 00000 00000";
  const phoneHref    = cleanTel(settings.contactPhone);

  const baseItems = [
    { label: "Phone",     value: phoneDisplay,                                Icon: Phone,     href: `tel:${phoneHref}` },
    { label: "Email",     value: settings.contactEmail     || "your@email.com",   Icon: Mail,      href: `mailto:${settings.contactEmail || "your@email.com"}` },
    { label: "Instagram", value: settings.contactInstagram || "@yourhandle",      Icon: Camera,    href: `https://instagram.com/${(settings.contactInstagram || "").replace('@', '')}` },
    { label: "GitHub",    value: settings.contactGithub    || "github.com/gurjot", Icon: GitBranch, href: `https://${(settings.contactGithub || "github.com/gurjot").replace(/^https?:\/\//, '')}` },
  ];

  const customItems = (settings.customContacts || []).map(c => ({
    label: c.label,
    value: c.value,
    Icon: User, // Fallback icon for dynamic links
    href: c.href
  }));

  const items = [...baseItems, ...customItems];
  const headingRef = useScrollReveal();

  return (
    <section className="contact" id="contact">
      <div className="contact-bg-text">Let's build</div>
      <div className="contact-inner">
        <div>
          <motion.p className="contact-eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>{settings.contactEyebrow || "Get in touch"}</motion.p>
          <h3 className="contact-h pm-underline" ref={headingRef}>{settings.contactHeadline || "Let's build something excellent together."}</h3>
          <motion.p className="contact-p" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>{settings.contactDescription || "Open to freelance projects, long-term collaborations, and interesting ideas."}</motion.p>
        </div>

        <motion.div className="contact-right" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealRight}>
          <div className="contact-info">
            {items.map(({ label, value, Icon, href }, i) => (
              <a 
                className="ci-item" key={label + i} href={href}
                target={href && href.startsWith('http') ? "_blank" : undefined}
                rel={href && href.startsWith('http') ? "noopener noreferrer" : undefined}
              >
                <Icon className="ci-icon" size={16} />
                <span className="ci-label">{label}</span>
                <span className="ci-val">{value}</span>
              </a>
            ))}
          </div>
          <a className="btn-cream" href={`mailto:${settings.contactEmail || "your@email.com"}`}>{settings.contactButtonText || "Send a Message"}</a>
        </motion.div>
      </div>
    </section>
  );
}