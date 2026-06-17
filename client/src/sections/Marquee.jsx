import { marqueeItems as defaultItems } from "../data/siteData";

export default function Marquee({ settings = {} }) {
  const src   = Array.isArray(settings.marqueeItems) && settings.marqueeItems.length ? settings.marqueeItems : defaultItems;
  const items = [...src, ...src]; // duplicate for seamless loop

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span className="marquee-item" key={`${item}-${i}`}>
            <span className="mdot pm-gold-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
