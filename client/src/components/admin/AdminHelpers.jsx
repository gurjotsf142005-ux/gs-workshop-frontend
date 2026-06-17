import { useState } from "react";

// ── Primitive inputs ──────────────────────────────────────────────────────────
export function AdminInput({ label, value = "", onChange, type = "text", placeholder = "" }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function AdminTextarea({ label, value = "", onChange, rows = 3, placeholder = "" }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────────────
export function AdminSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`adm-section ${open ? "is-open" : ""}`}>
      <button type="button" className="adm-section-toggle" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="adm-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="adm-section-body">{children}</div>}
    </div>
  );
}

// ── Simple string list editor (marqueeItems, techStack, navLinks labels) ──────
export function AdminStringList({ label, items = [], onChange, placeholder = "Add item…" }) {
  const add = () => onChange([...items, ""]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="adm-list">
      <span className="adm-label">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="adm-list-row">
          <input value={item} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="adm-rm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add</button>
    </div>
  );
}

// ── Object array editor (stats, services, aboutCards, heroMiniCards, navLinks, footerLinks) ──
// fields: [{ key, label, type? }]  type = "text" | "textarea" | "image"
export function AdminObjectList({ label, items = [], onChange, fields = [], defaultItem = {} }) {
  const add = () => onChange([...items, { ...defaultItem }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)));
  const move = (i, dir) => {
    const next = [...items];
    const swap = i + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]];
    onChange(next);
  };

  return (
    <div className="adm-objlist">
      <span className="adm-label">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="adm-objlist-card">
          <div className="adm-objlist-controls">
            <span className="adm-objlist-num">#{i + 1}</span>
            <div className="adm-objlist-btns">
              <button type="button" onClick={() => move(i, -1)}>↑</button>
              <button type="button" onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="adm-rm" onClick={() => remove(i)}>✕</button>
            </div>
          </div>
          {fields.map(({ key, label: fl, type = "text" }) =>
            type === "textarea" ? (
              <AdminTextarea key={key} label={fl} value={item[key] || ""} onChange={(v) => update(i, key, v)} />
            ) : (
              <AdminInput key={key} label={fl} value={item[key] || ""} onChange={(v) => update(i, key, v)} />
            )
          )}
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add {label}</button>
    </div>
  );
}

// ── Tags editor (aboutCards.tags) ─────────────────────────────────────────────
export function AdminTagList({ label, tags = [], onChange }) {
  const add = () => onChange([...tags, ""]);
  const remove = (i) => onChange(tags.filter((_, idx) => idx !== i));
  const update = (i, v) => onChange(tags.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="adm-tags-editor">
      <span className="adm-label">{label}</span>
      <div className="adm-tags-row">
        {tags.map((t, i) => (
          <div key={i} className="adm-tag-item">
            <input value={t} onChange={(e) => update(i, e.target.value)} placeholder="tag" />
            <button type="button" className="adm-rm" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="adm-add-tag" onClick={add}>+ Tag</button>
      </div>
    </div>
  );
}

// ── Save bar ──────────────────────────────────────────────────────────────────
export function AdminSaveBar({ saving, message }) {
  return (
    <div className="adm-savebar">
      {message && <span className={`adm-msg ${message.includes("Error") ? "is-error" : "is-ok"}`}>{message}</span>}
      <button type="submit" className="admin-primary" disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
