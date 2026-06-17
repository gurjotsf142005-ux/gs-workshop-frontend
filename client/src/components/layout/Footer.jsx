export default function Footer({ settings = {} }) {
  const links = Array.isArray(settings.footerLinks) && settings.footerLinks.length
    ? settings.footerLinks
    : [
        { label: "About",    href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Services", href: "#services" },
        { label: "Contact",  href: "#contact" },
      ];

  return (
    <footer className="footer">
      <div className="footer-logo">{settings.footerBrand || "GS WorkShope"}</div>
      <div className="footer-links">
        {links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
      </div>
      <div className="footer-copy">{settings.footerCopy || "© 2026 Gurjot Singh"}</div>
    </footer>
  );
}
