import { useState } from "react";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploadField({ value = "", onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB). Compress before uploading.");
      e.target.value = "";
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Cloudinary not configured — paste a URL above, or add VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_UPLOAD_PRESET to .env");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    
    // Tell Cloudinary to auto-optimize format (WebP for modern browsers)
    fd.append("transformation", "c_auto,q_auto");

    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { 
        method: "POST", 
        body: fd 
      });
      const data = await res.json();
      
      if (data.secure_url) {
        // Use Cloudinary transformation for smaller images
        const optimizedUrl = data.secure_url.replace(
          '/upload/', 
          '/upload/c_auto,q_auto,w_800/'
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

  // Generate blur-up placeholder (low quality, small size)
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
          
          {/* Blur-up placeholder while loading */}
          <img 
            className="adm-img-preview adm-img-blur"
            src={getBlurPlaceholder(value)}
            alt="Preview blur"
            aria-hidden="true"
            style={{ display: imageLoading ? 'block' : 'none' }}
          />
          
          {/* High-quality image with lazy loading */}
          <img 
            className="adm-img-preview"
            src={value}
            alt="Preview"
            loading="lazy"
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