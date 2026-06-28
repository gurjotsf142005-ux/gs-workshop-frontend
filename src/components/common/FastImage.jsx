import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FastImage — drop-in replacement for <img> that:
//   1. Builds an optimized Cloudinary URL (f_auto=WebP/AVIF, q_auto, resize)
//   2. Shows a blur placeholder (LQIP) while the full image loads
//   3. Fades the full image in when ready
//   4. Respects priority: eager load for hero, lazy for everything else
//
// Usage:
//   <FastImage src={project.imageURL} alt="My project" width={800} height={500} />
//   <FastImage src={s.heroImage} alt="Hero" width={1200} height={800} priority />
// ─────────────────────────────────────────────────────────────────────────────

function buildUrl(url, width) {
  if (!url || !url.includes("cloudinary.com")) return url;
  // Strip any existing transform to avoid stacking (e.g. f_auto on top of f_auto)
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_fill/`);
}

function buildBlurUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = url.replace(/\/upload\/([^/]+\/)*/, "/upload/");
  return clean.replace("/upload/", "/upload/w_30,q_10,e_blur:400/");
}

export default function FastImage({
  src,
  alt        = "",
  width      = 900,
  height     = 600,
  className  = "",
  priority   = false,  // true for above-the-fold images (hero). Sets loading="eager"
  cover      = true,
  style      = {},
}) {
  const [blurReady, setBlurReady] = useState(false);
  const [mainReady, setMainReady] = useState(false);

  if (!src) return null;

  const optimizedSrc = buildUrl(src, width);
  const blurSrc      = buildBlurUrl(src);

  return (
    <div
      className={className}
      style={{
        width:       "100%",
        aspectRatio: `${width} / ${height}`,
        position:    "relative",
        overflow:    "hidden",
        background:  "#111",
        ...style,
      }}
    >
      {/* Skeleton shimmer — shows before blur placeholder loads */}
      {!blurReady && !mainReady && (
        <div style={{
          position:         "absolute",
          inset:            0,
          background:       "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
          backgroundSize:   "200% 100%",
          animation:        "fi-shimmer 1.4s infinite",
        }} />
      )}

      {/* Blur placeholder — tiny file (~1KB), loads almost instantly */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        onLoad={() => setBlurReady(true)}
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  cover ? "cover" : "contain",
          filter:     "blur(16px)",
          transform:  "scale(1.06)", // hide blur edge artifacts
          opacity:    mainReady ? 0 : 1,
          transition: "opacity 0.35s ease",
          zIndex:     1,
        }}
      />

      {/* Full optimized image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setMainReady(true)}
        style={{
          position:   "absolute",
          inset:      0,
          width:      "100%",
          height:     "100%",
          objectFit:  cover ? "cover" : "contain",
          opacity:    mainReady ? 1 : 0,
          transition: "opacity 0.35s ease",
          zIndex:     2,
        }}
      />

      <style>{`
        @keyframes fi-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="fi-shimmer"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}