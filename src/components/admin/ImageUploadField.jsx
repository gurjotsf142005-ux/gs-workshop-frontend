import { useState } from "react";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploadField({ value = "", onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
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
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) onChange(data.secure_url);
      else setError("Upload failed — check your Cloudinary preset is set to Unsigned.");
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="adm-img-field">
      <label className="adm-field">
        <span className="adm-label">{label} (URL)</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
      </label>
      <label className="adm-field">
        <span className="adm-label">Or upload a file</span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      </label>
      {uploading && <p className="adm-hint">Uploading…</p>}
      {error    && <p className="adm-error">{error}</p>}
      {value    && <img className="adm-img-preview" src={value} alt="Preview" />}
    </div>
  );
}
