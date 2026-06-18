import { useState, useEffect } from "react";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_DIMENSION = 1600; // longest edge, px
const JPEG_QUALITY  = 0.8;

// Resize + compress in the browser BEFORE uploading.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let { width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
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
      img.onerror = () => reject(new Error("Could not read image."));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadField({ value = "", onChange, label = "Image", isCritical = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  // Aggressive Preloading: Injects a link rel="preload" into the document head if the image is critical.
  // This forces the browser to fetch the optimized image in the first 0.1 seconds of page load.
  useEffect(() => {
    if (isCritical && value && value.includes("cloudinary.com")) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = value;
      document.head.appendChild(link);

      // Cleanup preloader on unmount
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isCritical, value]);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB). Choose a smaller photo.");
      e.target.value = "";
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured — add VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_UPLOAD_PRESET to .env");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const compressedBlob = await compressImage(file);

      const fd = new FormData();
      fd.append("file", compressedBlob, file.name.replace(/\.\w+$/, ".jpg"));
      fd.append("upload_preset", UPLOAD_PRESET);

      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: fd
      });
      const data = await res.json();

      if (data.secure_url) {
        // f_auto instructs Cloudinary to dynamically serve WebP/AVIF
        const optimizedUrl = data.secure_url.replace(
          '/upload/',
          '/upload/c_auto,q_auto,f_auto,w_800/'
        );
        onChange(optimizedUrl);
      } else {
        setError("Upload failed — check your Cloudinary preset is set to Unsigned.");
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function getBlurPlaceholder(url) {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace('/upload/', '/upload/q_10,w_20/');
  }

  return (
    <div className="adm-img-field">
      <label className="adm-field">
        <span className="adm-label">{label} (URL)</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      </label>

      <label className="adm-field">
        <span className="adm-label">Or upload a file</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
        />
        {uploading && <p className="adm-hint">Compressing & uploading…</p>}
      </label>

      {error && <p className="adm-error">{error}</p>}

      {value && (
        <div className="adm-img-preview-wrapper">
          {imageLoading && <div className="adm-img-skeleton">Loading…</div>}

          <img
            className="adm-img-preview adm-img-blur"
            src={getBlurPlaceholder(value)}
            alt="Preview blur"
            aria-hidden="true"
            style={{ display: imageLoading ? 'block' : 'none' }}
          />

          <img
            className="adm-img-preview"
            src={value}
            alt="Preview"
            // If the image is critical, load it eagerly (immediately), otherwise lazily
            loading={isCritical ? "eager" : "lazy"} 
            onLoad={() => setImageLoading(false)}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        </div>
      )}

      <style>{`
        .adm-img-preview-wrapper {
          position: relative;
          width: 100%;
          max-width: 300px;
        }

        .adm-img-blur {
          filter: blur(20px);
          position: absolute;
          top: 0;
          left: 0;
        }

        .adm-img-skeleton {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 12px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}