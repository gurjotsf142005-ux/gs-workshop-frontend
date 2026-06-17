const mongoose = require('mongoose');

const miniCardSchema = new mongoose.Schema({ label: String, value: String, sub: String }, { _id: false });
const statSchema = new mongoose.Schema({ value: String, label: String }, { _id: false });
const serviceSchema = new mongoose.Schema({ number: String, title: String, text: String, imageURL: String }, { _id: false });
const aboutCardSchema = new mongoose.Schema({ title: String, subtitle: String, body: String, tags: [String] }, { _id: false });
const navLinkSchema = new mongoose.Schema({ label: String, href: String }, { _id: false });
const footerLinkSchema = new mongoose.Schema({ label: String, href: String }, { _id: false });

const siteSettingSchema = new mongoose.Schema({
  // ── Navbar ──────────────────────────────────────────────────────
  navName:    { type: String, default: 'Gurjot Singh' },
  navBrand:   { type: String, default: 'GS WorkShope' },
  navStatus:  { type: String, default: 'Available for work' },
  navCta:     { type: String, default: 'Hire Me' },
  navLinks:   { type: [navLinkSchema], default: [
    { label: 'About',    href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact',  href: '#contact' },
  ]},

  // ── Hero ─────────────────────────────────────────────────────────
  heroEyebrow:       { type: String, default: 'Full-Stack Developer - MERN Stack' },
  heroHeadline:      { type: String, default: 'I build modern web experiences that feel premium.' },
  heroDescription:   { type: String, default: 'I help founders, businesses, and hiring teams turn ideas into fast, polished web products.' },
  heroPrimaryCta:    { type: String, default: 'View Projects' },
  heroSecondaryCta:  { type: String, default: "Let's Talk" },
  heroImage:         { type: String, default: '' },
  heroImageAlt:      { type: String, default: 'Gurjot Singh working at a desk' },
  heroBadge:         { type: String, default: 'Available for freelance & full-time roles' },
  heroBrand:         { type: String, default: 'GS WorkShope' },
  heroMiniCards:     { type: [miniCardSchema], default: [] },
  techStack:         { type: [String], default: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Figma'] },

  // ── Marquee ──────────────────────────────────────────────────────
  marqueeItems: { type: [String], default: [
    'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS',
    'Framer Motion', 'REST APIs', 'JWT Auth', 'Mongoose', 'Figma',
  ]},

  // ── Stats ────────────────────────────────────────────────────────
  stats: { type: [statSchema], default: [
    { value: '12+',  label: 'PROJECTS SHIPPED' },
    { value: '8+',   label: 'HAPPY CLIENTS' },
    { value: '3+',   label: 'YEARS BUILDING' },
    { value: '100%', label: 'CLEAN CODE DELIVERED' },
  ]},

  // ── Services / Features ──────────────────────────────────────────
  servicesEyebrow:     { type: String, default: 'What I offer' },
  servicesHeadline:    { type: String, default: 'Crafting products that feel effortless to use.' },
  servicesDescription: { type: String, default: 'Architecture that\'s clean today and maintainable tomorrow.' },
  servicesCta:         { type: String, default: 'Download Resume' },
  servicesCtaUrl:      { type: String, default: '#contact' },
  services:            { type: [serviceSchema], default: [
    { number: '01', title: 'Full-Stack Development', text: 'End-to-end MERN apps built to scale.', imageURL: '' },
    { number: '02', title: 'UI/UX Design',           text: 'Clean, modern interfaces your users will love.', imageURL: '' },
    { number: '03', title: 'API Architecture',        text: 'Robust REST APIs with auth, rate-limiting, and docs.', imageURL: '' },
    { number: '04', title: 'Performance Audits',      text: 'Lighthouse scores you can show clients.', imageURL: '' },
  ]},

  // ── Projects section intro ───────────────────────────────────────
  projectsEyebrow:     { type: String, default: 'Selected work' },
  projectsHeadline:    { type: String, default: 'Projects built with purpose.' },
  projectsDescription: { type: String, default: 'A cross-section of what I ship: SaaS tools, portfolio sites, and client products.' },
  projectsCta:         { type: String, default: 'View All Projects' },
  projectsCtaUrl:      { type: String, default: '#contact' },

  // ── About ────────────────────────────────────────────────────────
  aboutEyebrow:   { type: String, default: 'About Gurjot' },
  aboutHeadline:  { type: String, default: 'Full-stack thinking with a product-first eye.' },
  aboutTextOne:   { type: String, default: "I'm Gurjot Singh, a full-stack developer focused on building modern web products that feel refined, reliable, and easy to use." },
  aboutTextTwo:   { type: String, default: 'Through GS WorkShope, I help clients and teams turn ideas into polished digital experiences using the MERN stack.' },
  aboutCards:     { type: [aboutCardSchema], default: [] },

  // ── Contact ──────────────────────────────────────────────────────
  contactEyebrow:     { type: String, default: 'Get in touch' },
  contactHeadline:    { type: String, default: "Let's build something excellent together." },
  contactDescription: { type: String, default: 'Open to freelance projects, long-term collaborations, and interesting ideas.' },
  contactName:        { type: String, default: 'Gurjot Singh' },
  contactEmail:       { type: String, default: 'your@email.com' },
  contactInstagram:   { type: String, default: '@yourhandle' },
  contactGithub:      { type: String, default: 'github.com/gurjot' },
  contactButtonText:  { type: String, default: 'Send a Message' },

  // ── Footer ───────────────────────────────────────────────────────
  footerBrand: { type: String, default: 'GS WorkShope' },
  footerCopy:  { type: String, default: '© 2026 Gurjot Singh' },
  footerLinks: { type: [footerLinkSchema], default: [
    { label: 'About',    href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact',  href: '#contact' },
  ]},
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
