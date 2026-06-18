import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { getPublicProjects } from "../services/api";
import { useScrollReveal, useTilt } from "../utils/premiumMotion";

function TiltProjectCard({ p, index }) {
  const tiltRef  = useTilt(7);
  const cardRef  = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, amount: 0.12 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.08,
        },
      });
    }
  }, [isInView, controls, index]);

  return (
    <div ref={cardRef} style={{ width: "100%" }}>
      <motion.article
        className="project-card pm-tilt"
        initial={{ opacity: 0 }}
        animate={controls}
        style={{ width: "100%" }}
      >
        <div
          ref={tiltRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="pc-img-wrap">
            {p.imageURL && (
              <img src={p.imageURL} alt={p.title} loading="lazy" />
            )}
            <div className="pc-overlay">
              {p.liveURL && (
                <a
                  href={p.liveURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pc-link pm-mobile-inline"
                >
                  Live
                </a>
              )}
              {p.githubURL && (
                <a
                  href={p.githubURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pc-link pm-mobile-inline"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          <div className="pc-body">
            <h3 className="pc-title">{p.title}</h3>
            <p className="pc-desc">{p.desc}</p>
            <div className="pc-tags">
              {(p.techStack || []).map((t) => (
                <span className="pc-tag pm-tag-gold" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function FadeIn({ children, className, delay }) {
  const ref      = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
          delay: delay || 0,
        },
      });
    }
  }, [isInView, controls, delay]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

function AnimatedHeading({ children, className }) {
  const ref       = useRef(null);
  const controls  = useAnimation();
  const isInView  = useInView(ref, { once: true, amount: 0.3 });
  const scrollRef = useScrollReveal();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });
    }
  }, [isInView, controls]);

  function setRefs(el) {
    ref.current = el;
    scrollRef.current = el;
  }

  return (
    <motion.h2
      ref={setRefs}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
    >
      {children}
    </motion.h2>
  );
}

export default function Projects({ settings }) {
  const cfg = settings || {};
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getPublicProjects({ limit: 12 })
      .then(function(d) { setProjects(d.projects || []); })
      .catch(function() {})
      .finally(function() { setLoading(false); });
  }, []);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-top">
        <FadeIn className="projects-eyebrow">
          {cfg.projectsEyebrow || "Selected work"}
        </FadeIn>

        <AnimatedHeading className="projects-h2 pm-underline">
          {cfg.projectsHeadline || "Projects built with purpose."}
        </AnimatedHeading>

        {cfg.projectsDescription && (
          <FadeIn className="projects-desc" delay={0.1}>
            {cfg.projectsDescription}
          </FadeIn>
        )}
      </div>

      {loading ? (
        <div className="projects-loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="projects-empty">No projects yet.</div>
      ) : (
        <div className="projects-grid">
          {projects.map(function(p, i) {
            return <TiltProjectCard p={p} key={p._id} index={i} />;
          })}
        </div>
      )}

      {cfg.projectsCta && (
        <FadeIn className="projects-cta-wrap" delay={0.1}>
          <a
            className="btn-ghost pm-gold"
            href={cfg.projectsCtaUrl || "#contact"}
          >
            {cfg.projectsCta} →
          </a>
        </FadeIn>
      )}
    </section>
  );
}