import { Code, Layers, Zap, BarChart2 } from 'lucide-react';

export const siteSettingsDefaults = {
  navName: 'Gurjot Singh', navBrand: 'GS WorkShope', navStatus: 'Available for work', navCta: 'Hire Me',
  navLinks: [{ label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' }, { label: 'Contact', href: '#contact' }],
  heroEyebrow: 'Full-Stack Developer - MERN Stack',
  heroHeadline: 'I build modern web experiences that feel premium.',
  heroDescription: 'I help founders, businesses, and hiring teams turn ideas into fast, polished web products.',
  heroPrimaryCta: 'View Projects', heroSecondaryCta: "Let's Talk",
  heroImage: '', heroImageAlt: 'Gurjot Singh', heroBadge: 'Available for freelance & full-time roles', heroBrand: 'GS WorkShope',
  heroMiniCards: [], techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Figma'],
  marqueeItems: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion', 'REST APIs', 'JWT Auth'],
  stats: [
    { value: '12+', label: 'PROJECTS SHIPPED' }, { value: '8+', label: 'HAPPY CLIENTS' },
    { value: '3+',  label: 'YEARS BUILDING' },   { value: '100%', label: 'CLEAN CODE DELIVERED' },
  ],
  servicesEyebrow: 'What I offer', servicesHeadline: 'Crafting products that feel effortless to use.',
  servicesDescription: "Architecture that's clean today and maintainable tomorrow.",
  servicesCta: 'Download Resume', servicesCtaUrl: '#contact',
  projectsEyebrow: 'Selected work', projectsHeadline: 'Projects built with purpose.',
  projectsDescription: 'A cross-section of what I ship: SaaS tools, portfolio sites, and client products.',
  projectsCta: 'View All Projects', projectsCtaUrl: '#contact',
  aboutEyebrow: 'About Gurjot', aboutHeadline: 'Full-stack thinking with a product-first eye.',
  aboutTextOne: "I'm Gurjot Singh, a full-stack developer focused on building modern web products.",
  aboutTextTwo: 'Through GS WorkShope, I help clients and teams turn ideas into polished digital experiences.',
  contactEyebrow: 'Get in touch', contactHeadline: "Let's build something excellent together.",
  contactDescription: 'Open to freelance projects, long-term collaborations, and interesting ideas.',
  contactName: 'Gurjot Singh', contactEmail: 'your@email.com',
  contactInstagram: '@yourhandle', contactGithub: 'github.com/gurjot', contactButtonText: 'Send a Message',
  footerBrand: 'GS WorkShope', footerCopy: '© 2026 Gurjot Singh',
  footerLinks: [
    { label: 'About', href: '#about' }, { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' }, { label: 'Contact', href: '#contact' },
  ],
};

export function mergeSiteSettings(apiData = {}) {
  return { ...siteSettingsDefaults, ...apiData };
}

// Fallback icon services (when no imageURL supplied)
export const services = [
  { number: '01', title: 'Full-Stack Development', text: 'End-to-end MERN apps built to scale.', Icon: Code },
  { number: '02', title: 'UI/UX Design',           text: 'Clean, modern interfaces your users will love.', Icon: Layers },
  { number: '03', title: 'API Architecture',        text: 'Robust REST APIs with auth and rate-limiting.', Icon: Zap },
  { number: '04', title: 'Performance Audits',      text: 'Lighthouse scores you can show clients.', Icon: BarChart2 },
];

export const aboutCards = [
  { title: 'Frontend', subtitle: 'React · Tailwind', body: 'Pixel-perfect UIs with smooth motion and real accessibility.', Icon: Layers, tags: ['React', 'Tailwind', 'Framer Motion'] },
  { title: 'Backend',  subtitle: 'Node · Express · MongoDB', body: 'Reliable APIs, auth flows, and data modeling that scale.', Icon: Code,   tags: ['Node.js', 'Express', 'MongoDB'] },
  { title: 'Shipping', subtitle: 'CI/CD · Render · Vercel',  body: 'From commit to production — fast and with zero drama.',    Icon: Zap,    tags: ['Vercel', 'Render', 'GitHub Actions'] },
];

export const marqueeItems = [
  'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS',
  'Framer Motion', 'REST APIs', 'JWT Auth', 'Mongoose', 'Figma',
];
