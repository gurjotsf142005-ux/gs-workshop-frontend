import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { getPublicProjects } from "../services/api";
import { useTilt, useScrollReveal } from "../lib/hooks";
import "../styles/royal-ledger.css";

// ── Cloudinary helpers ────────────────────────────────────────────────────────
// Strip any existing transform then apply fresh ones so we never stack
// f_auto on top of f_auto (which breaks the URL).
function buildCardUrl(url, width = 600) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_fill/`);
}

function buildBlurUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", "/upload/w_30,q_10,e_blur:400/");
}

// ── Project image with LQIP blur placeholder ─────────────────────────────────
function ProjectImage({ src, alt }) {
  const [blurReady, setBlurReady] = useState(false);
  const [mainReady, setMainReady] = useState(false);

  if (!src) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Skeleton */}
      {!blurReady && !mainReady && (
        <div style={{
          position:       "absolute",
          inset:          0,
          background:     "linear-gradient(90deg,#1a1a1a 25%,#2a2a2a 50%,#1a1a1a 75%)",
          backgroundSize: "200% 100%",
          animation:      "shimmer 1.4s infinite",
        }} />
      )}

      {/* Blur placeholder */}
      <img
        src={buildBlurUrl(src)}
        alt=""
        aria-hidden="true"
        onLoad={() => setBlurReady(true)}
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  "cover",
          filter:     "blur(14px)",
          transform:  "scale(1.06)",
          opacity:    mainReady ? 0 : 1,
          transition: "opacity 0.35s ease",
          zIndex:     1,
        }}
      />

      {/* Full image */}
      <img
        src={buildCardUrl(src, 600)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setMainReady(true)}
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  "cover",
          opacity:    mainReady ? 1 : 0,
          transition: "opacity 0.35s ease",
          zIndex:     2,
        }}
      />
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
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
            <ProjectImage src={p.imageURL} alt={p.title} />
            <div className="pc-overlay">
              {p.liveURL && (
                <a href={p.liveURL} target="_blank" rel="noopener noreferrer" className="pc-link pm-mobile-inline">
                  Live
                </a>
              )}
              {p.githubURL && (
                <a href={p.githubURL} target="_blank" rel="noopener noreferrer" className="pc-link pm-mobile-inline">
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

// ── Animation helpers ─────────────────────────────────────────────────────────
function FadeIn({ children, className, delay }) {
  const ref      = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1, y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: delay || 0 },
      });
    }
  }, [isInView, controls, delay]);

  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 16 }} animate={controls}>
      {children}
    </motion.div>
  );
}

function AnimatedHeading({ children, className }) {
  const ref      = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const scrollRef = useScrollReveal();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });
    }
  }, [isInView, controls]);

  function setRefs(el) {
    ref.current = el;
    scrollRef.current = el;
  }

  return (
    <motion.h2 ref={setRefs} className={className} initial={{ opacity: 0, y: 20 }} animate={controls}>
      {children}
    </motion.h2>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Projects({ settings }) {
  const cfg = settings || {};
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // WHY: getPublicProjects expects a plain query object.
    // api.js converts it with URLSearchParams → /api/projects?limit=12
    // Old code passed { limit: 12 } directly into the URL string → [object Object]
    getPublicProjects({ limit: 12 })
      .then((d) => { setProjects(d.projects || []); })
      .catch(() => {})
      .finally(() => { setLoading(false); });
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
        <div className="projects-loading">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="projects-empty">No projects yet.</div>
      ) : (
        <div className="projects-grid">
          {projects.map((p, i) => (
            <TiltProjectCard p={p} key={p._id} index={i} />
          ))}
        </div>
      )}

      {cfg.projectsCta && (
        <FadeIn className="projects-cta-wrap" delay={0.1}>
          <a className="btn-ghost pm-gold" href={cfg.projectsCtaUrl || "#contact"}>
            {cfg.projectsCta} →
          </a>
        </FadeIn>
      )}
    </section>
  );
}