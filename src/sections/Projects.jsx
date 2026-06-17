import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicProjects } from "../services/api";
import { reveal, stagger } from "../utils/motion";
import { useTilt, useScrollReveal } from "../utils/premiumMotion";

function TiltProjectCard({ p }) {
  const tiltRef = useTilt(7);

  return (
    <motion.article className="project-card pm-tilt" variants={reveal} ref={tiltRef}>
      <div className="pc-img-wrap">
        <img src={p.imageURL} alt={p.title} loading="lazy" />
        <div className="pc-overlay">
          {p.liveURL   && <a href={p.liveURL}   target="_blank" rel="noopener noreferrer" className="pc-link pm-mobile-inline">Live ↗</a>}
          {p.githubURL && <a href={p.githubURL} target="_blank" rel="noopener noreferrer" className="pc-link pm-mobile-inline">GitHub ↗</a>}
        </div>
      </div>
      <div className="pc-body">
        <h3 className="pc-title">{p.title}</h3>
        <p  className="pc-desc">{p.desc}</p>
        <div className="pc-tags">
          {(p.techStack || []).map((t) => <span className="pc-tag pm-tag-gold" key={t}>{t}</span>)}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects({ settings = {} }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const headingRef = useScrollReveal();

  useEffect(() => {
    getPublicProjects({ limit: 12 })
      .then((d) => setProjects(d.projects || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-top">
        <motion.p className="projects-eyebrow" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          {settings.projectsEyebrow || "Selected work"}
        </motion.p>
        <h2 className="projects-h2 pm-underline" ref={headingRef}>
          {settings.projectsHeadline || "Projects built with purpose."}
        </h2>
        {settings.projectsDescription && (
          <motion.p className="projects-desc" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            {settings.projectsDescription}
          </motion.p>
        )}
      </div>

      {loading ? (
        <div className="projects-loading">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="projects-empty">No projects yet.</div>
      ) : (
        <motion.div className="projects-grid"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          {projects.map((p) => <TiltProjectCard p={p} key={p._id} />)}
        </motion.div>
      )}

      {settings.projectsCta && (
        <motion.div className="projects-cta-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          <a className="btn-ghost pm-gold" href={settings.projectsCtaUrl || "#contact"}>{settings.projectsCta} →</a>
        </motion.div>
      )}
    </section>
  );
}
