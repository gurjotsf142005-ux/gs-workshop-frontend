import { motion } from "framer-motion";
import { reveal } from "../utils/motion";
import { useScrollReveal } from "../utils/premiumMotion";

const DEFAULT_STATS = [
  { value: "12+",  label: "PROJECTS SHIPPED" },
  { value: "8+",   label: "HAPPY CLIENTS" },
  { value: "3+",   label: "YEARS BUILDING" },
  { value: "100%", label: "CLEAN CODE DELIVERED" },
];

function StatItem({ stat, i }) {
  const ref = useScrollReveal();
  return (
    <motion.div className="sdiv pm-stat" ref={ref} key={i}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
      variants={reveal} transition={{ delay: i * 0.07 }}>
      <div className="sdiv-num pm-num">{stat.value || "0"}</div>
      <div className="sdiv-label">{String(stat.label || "").toUpperCase()}</div>
    </motion.div>
  );
}

export default function Stats({ settings = {} }) {
  const stats = Array.isArray(settings.stats) && settings.stats.length ? settings.stats : DEFAULT_STATS;

  return (
    <section className="section-divider">
      {stats.map((stat, i) => <StatItem stat={stat} i={i} key={i} />)}
    </section>
  );
}
