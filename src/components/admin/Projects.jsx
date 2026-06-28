import { useEffect, useState } from "react";
import { getAllProjects, createProject, updateProject, deleteProject } from "../../services/api";
import AdminLayout    from "./AdminLayout";
import ImageUploadField from "./ImageUploadField";
import { AdminInput, AdminTextarea, AdminStringList } from "./AdminHelpers";

// WHY: import FastImage so project card thumbnails get the same
// Cloudinary optimization + lazy loading as the public site.
import FastImage from "../common/FastImage";

const EMPTY = {
  title:     "",
  desc:      "",
  imageURL:  "",
  techStack: [],
  liveURL:   "",
  githubURL: "",
  featured:  false,
  status:    "published",
  order:     0,
};

export default function Projects({ onLogout }) {
  const [projects,  setProjects]  = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [message,   setMsg]       = useState("");
  const [showForm,  setShowForm]  = useState(false);

  async function load() {
    try {
      // WHY: call the admin endpoint, not the public one.
      // Public /api/projects only returns published projects.
      // Admin needs drafts too, and uses the auth token.
      const token = localStorage.getItem("adminToken");
      const res   = await fetch("/api/admin/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      setProjects(d.projects || []);
    } catch {
      setMsg("Error loading projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function flash(msg) {
    setMsg(msg);
    setTimeout(() => setMsg(""), 4000);
  }

  function startEdit(p) {
    setForm({ ...EMPTY, ...p, techStack: p.techStack || [] });
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url   = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PUT" : "POST";
      const res   = await fetch(url, {
        method,
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      flash(editingId ? "✓ Project updated!" : "✓ Project created!");
      cancelEdit();
      await load();
    } catch (err) {
      flash("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`/api/admin/projects/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      flash("Project deleted.");
      await load();
    } catch {
      flash("Error deleting project.");
    }
  }

  function upd(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">Projects</h1>
          {!showForm && (
            <button
              className="admin-primary"
              onClick={() => { setForm(EMPTY); setEditingId(null); setShowForm(true); }}
            >
              + New Project
            </button>
          )}
        </div>

        {message && (
          <p className={`adm-msg ${message.includes("Error") ? "is-error" : "is-ok"}`}>
            {message}
          </p>
        )}

        {/* ── Project form ──────────────────────────────────────────── */}
        {showForm && (
          <form className="admin-card adm-project-form" onSubmit={handleSave}>
            <h2 className="adm-card-title">
              {editingId ? "Edit Project" : "New Project"}
            </h2>

            <div className="adm-grid-2">
              <AdminInput label="Title *"      value={form.title}     onChange={(v) => upd("title", v)} />
              <AdminInput label="Order (sort)" value={form.order}     onChange={(v) => upd("order", Number(v))} type="number" />
              <AdminInput label="Live URL"     value={form.liveURL}   onChange={(v) => upd("liveURL", v)} />
              <AdminInput label="GitHub URL"   value={form.githubURL} onChange={(v) => upd("githubURL", v)} />
            </div>

            <AdminTextarea
              label="Description *"
              value={form.desc}
              onChange={(v) => upd("desc", v)}
              rows={3}
            />

            {/* isCritical=false — project images are not hero-level */}
            <ImageUploadField
              label="Project Image *"
              value={form.imageURL}
              onChange={(v) => upd("imageURL", v)}
              isCritical={false}
            />

            <AdminStringList
              label="Tech Stack"
              items={form.techStack}
              onChange={(v) => upd("techStack", v)}
              placeholder="e.g. React"
            />

            <div className="adm-grid-2">
              <label className="adm-field adm-checkbox-row">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => upd("featured", e.target.checked)}
                />
                <span>Featured</span>
              </label>

              <label className="adm-field">
                <span className="adm-label">Status</span>
                <select value={form.status} onChange={(e) => upd("status", e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>

            <div className="adm-form-actions">
              <button type="submit" className="admin-primary" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
              <button type="button" className="admin-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Project grid ──────────────────────────────────────────── */}
        {loading ? (
          <p className="adm-loading">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="adm-empty">
            No projects yet. Click <strong>+ New Project</strong> to add one.
          </div>
        ) : (
          <div className="admin-project-grid">
            {projects.map((p) => (
              <div key={p._id} className="admin-project-card">
                {/* WHY FastImage here: lazy loads, blur placeholder,
                    Cloudinary optimization. The old code used a raw <img>
                    with the full imageURL — no compression, no lazy load. */}
                {p.imageURL && (
                  <FastImage
                    src={p.imageURL}
                    alt={p.title}
                    width={400}
                    height={240}
                    className="admin-project-thumb"
                    cover
                  />
                )}
                <div className="admin-project-body">
                  <h3>{p.title}</h3>
                  <p className="admin-project-tags">
                    {(p.techStack || []).join(", ")}
                  </p>
                  <div className="adm-project-badges">
                    {p.featured && (
                      <span className="adm-badge featured">⭐ Featured</span>
                    )}
                    <span className={`adm-badge ${p.status}`}>{p.status}</span>
                  </div>
                  <div className="adm-form-actions">
                    <button className="admin-secondary" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="adm-danger" onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}