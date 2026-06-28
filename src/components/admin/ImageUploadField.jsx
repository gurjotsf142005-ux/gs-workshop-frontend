import { useState, useEffect, useRef } from "react";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_DIMENSION = 1600;  // Longest edge in px. 1600px @ 2× DPR = 800px CSS — enough for any layout.
const JPEG_QUALITY  = 0.82;  // 0.82 is the sweet spot: visually identical to 1.0, ~60% smaller file.

// ─────────────────────────────────────────────────────────────────────────────
// WHY WE COMPRESS BEFORE UPLOADING
// A phone photo is 3–8 MB at 4000+ px wide. Uploading it raw wastes your
// Cloudinary bandwidth quota, slows the upload, and makes every future page
// load serve a giant source file even after Cloudinary resizes it for delivery.
// We resize + JPEG-compress in the browser first → typical result is 150–400 KB.
// ─────────────────────────────────────────────────────────────────────────────
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let width  = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width  = MAX_DIMENSION;
          } else {
            width  = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high"; // Better downscale algorithm — prevents blurry edges
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("Compression failed.")); return; }
            resolve(blob);
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };
      img.onerror = () => reject(new Error("Could not decode image."));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY WE BUILD CLOUDINARY URLS AT RENDER TIME (not at upload time)
// Storing the raw uploaded URL and applying transforms at render gives you
// flexibility — you can change the width or format without re-uploading.
// We strip any existing transform first to avoid double-applying params.
//
// FIX: the old regex /\/upload\/([^/]+\/)*/ greedily stripped EVERY segment
// after "/upload/" — including the version hash (e.g. "v1782632999/") — not
// just a transform block. That silently broke stored URLs. This version only
// strips a segment that actually looks like a transform (comma-separated
// "letter_value" pairs like "w_800", "f_auto"), leaving the version intact.
// ─────────────────────────────────────────────────────────────────────────────
function stripTransform(url) {
  return url.replace(/\/upload\/(?:[a-z]+_[^/,]+,)*[a-z]+_[^/,]+\//, "/upload/");
}

function buildCloudinaryUrl(url, width = 800) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = stripTransform(url);
  return clean.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

// Tiny 20px blurred version for LQIP (Low Quality Image Placeholder).
// WHY: Loads in ~1 network round trip (< 1 KB), gives the brain a colour-
// correct placeholder while the real image loads. Feels instant vs blank space.
function buildBlurUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const clean = stripTransform(url);
  return clean.replace("/upload/", "/upload/w_20,q_10,e_blur:300/");
}

// Only these MIME types. accept="image/*" is a UI hint only — doesn't block anything.
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export default function ImageUploadField({
  value      = "",
  onChange,
  label      = "Image",
  isCritical = false,  // true = hero image. Preloads at w_1200, loading="eager"
}) {
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState("");
  const [blurReady,  setBlurReady]  = useState(false);
  const [mainReady,  setMainReady]  = useState(false);
  const preloadRef = useRef(null);

  useEffect(() => {
    setBlurReady(false);
    setMainReady(false);
  }, [value]);

  useEffect(() => {
    if (!isCritical || !value || !value.includes("cloudinary.com")) return;

    const link  = document.createElement("link");
    link.rel    = "preload";
    link.as     = "image";
    link.href   = buildCloudinaryUrl(value, 1200);
    document.head.appendChild(link);
    preloadRef.current = link;

    return () => {
      if (preloadRef.current) {
        try { document.head.removeChild(preloadRef.current); } catch (_) {}
        preloadRef.current = null;
      }
    };
  }, [isCritical, value]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Only JPG, PNG, WebP, GIF, or AVIF images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5 MB). Compress it first or choose a smaller photo.");
      e.target.value = "";
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured — check your .env file has VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const blob = await compressImage(file);

      const fd = new FormData();
      fd.append("file",          blob, file.name.replace(/\.[^.]+$/, ".jpg"));
      fd.append("upload_preset", UPLOAD_PRESET);

      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body:   fd,
      });
      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError("Upload failed — make sure your Cloudinary preset is set to Unsigned.");
      }
    } catch (err) {
      setError("Upload error: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleUrlBlur(e) {
    const url = e.target.value.trim();
    if (url.includes("cloudinary.com") && !url.includes("f_auto")) {
      onChange(buildCloudinaryUrl(url, isCritical ? 1200 : 800));
    }
  }

  const deliveryUrl = buildCloudinaryUrl(value, isCritical ? 1200 : 800);
  const blurUrl     = buildBlurUrl(value);

  return (
    <div className="adm-img-field">

      <label className="adm-field">
        <span className="adm-label">{label} (URL)</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleUrlBlur}
          placeholder="https://res.cloudinary.com/..."
        />
      </label>

      <label className="adm-field">
        <span className="adm-label">Or upload a file</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFile}
          disabled={uploading}
        />
        {uploading && <p className="adm-hint">Compressing &amp; uploading…</p>}
      </label>

      {error && <p className="adm-error">{error}</p>}

      {value && (
        <div className="adm-preview-wrap">

          {!blurReady && !mainReady && (
            <div className="adm-skeleton" aria-hidden="true" />
          )}

          <img
            className="adm-img adm-img-blur"
            src={blurUrl}
            alt=""
            aria-hidden="true"
            onLoad={() => setBlurReady(true)}
            style={{ opacity: mainReady ? 0 : 1 }}
          />

          <img
            className="adm-img adm-img-main"
            src={deliveryUrl}
            alt="Preview"
            loading={isCritical ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setMainReady(true)}
            style={{ opacity: mainReady ? 1 : 0 }}
          />
        </div>
      )}

      <style>{`
        .adm-preview-wrap {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          background: #1a1a1a;
          margin-top: 8px;
        }
        .adm-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.35s ease;
        }
        .adm-img-blur {
          z-index: 1;
          filter: blur(14px);
          transform: scale(1.06);
        }
        .adm-img-main {
          z-index: 2;
        }
        .adm-skeleton {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
          background-size: 200% 100%;
          animation: adm-shimmer 1.5s infinite;
        }
        @keyframes adm-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adm-skeleton { animation: none; }
          .adm-img      { transition: none; }
        }
      `}</style>
    </div>
  );
}