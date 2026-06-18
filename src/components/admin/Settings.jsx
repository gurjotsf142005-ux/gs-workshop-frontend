import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/api";
import AdminLayout from "./AdminLayout";
import ImageUploadField from "./ImageUploadField";
import {
  AdminInput, AdminTextarea, AdminSection,
  AdminStringList, AdminObjectList, AdminSaveBar,
} from "./AdminHelpers";

export default function Settings({ onLogout }) {
  const [s, setS]         = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMsg]   = useState("");

  useEffect(() => {
    getSettings().then((d) => setS(d.settings)).catch(() => setMsg("Error loading settings."));
  }, []);

  function upd(key, val) { setS((prev) => ({ ...prev, [key]: val })); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await updateSettings(s);
      setMsg("✓ Saved successfully!");
    } catch {
      setMsg("Error saving — check your connection.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 4000);
    }
  }

  if (!s) return (
    <AdminLayout onLogout={onLogout}>
      <div className="adm-page"><p className="adm-loading">Loading settings…</p></div>
    </AdminLayout>
  );

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">Site Settings</h1>
          <p className="adm-page-sub">100% control over every section. Changes save to the database instantly.</p>
        </div>

        <form onSubmit={handleSave}>

          {/* ── NAVBAR ──────────────────────────────────────────────── */}
          <AdminSection title="🔗 Navbar" defaultOpen>
            <div className="adm-grid-2">
              <AdminInput label="Your Name"   value={s.navName}   onChange={(v) => upd("navName", v)} />
              <AdminInput label="Brand Text"  value={s.navBrand}  onChange={(v) => upd("navBrand", v)} />
              <AdminInput label="Status Badge" value={s.navStatus} onChange={(v) => upd("navStatus", v)} />
              <AdminInput label="CTA Button"  value={s.navCta}    onChange={(v) => upd("navCta", v)} />
            </div>
            <AdminObjectList
              label="Nav Links"
              items={s.navLinks || []}
              onChange={(v) => upd("navLinks", v)}
              fields={[
                { key: "label", label: "Link Label" },
                { key: "href",  label: "Href (e.g. #about)" },
              ]}
              defaultItem={{ label: "", href: "" }}
            />
          </AdminSection>

          {/* ── HERO ────────────────────────────────────────────────── */}
          <AdminSection title="🦸 Hero">
            <div className="adm-grid-2">
              <AdminInput label="Eyebrow"          value={s.heroEyebrow}      onChange={(v) => upd("heroEyebrow", v)} />
              <AdminInput label="Badge Text"        value={s.heroBadge}        onChange={(v) => upd("heroBadge", v)} />
              <AdminInput label="Brand (photo card)" value={s.heroBrand}       onChange={(v) => upd("heroBrand", v)} />
              <AdminInput label="Image Alt Text"    value={s.heroImageAlt}     onChange={(v) => upd("heroImageAlt", v)} />
              <AdminInput label="Primary CTA"       value={s.heroPrimaryCta}   onChange={(v) => upd("heroPrimaryCta", v)} />
              <AdminInput label="Secondary CTA"     value={s.heroSecondaryCta} onChange={(v) => upd("heroSecondaryCta", v)} />
            </div>
            <AdminTextarea label="Headline"    value={s.heroHeadline}    onChange={(v) => upd("heroHeadline", v)} rows={2} />
            <AdminTextarea label="Description" value={s.heroDescription} onChange={(v) => upd("heroDescription", v)} rows={3} />
            <ImageUploadField label="Hero Photo" value={s.heroImage || ""} onChange={(v) => upd("heroImage", v)} />
            <AdminObjectList
              label="Mini Cards"
              items={s.heroMiniCards || []}
              onChange={(v) => upd("heroMiniCards", v)}
              fields={[
                { key: "label", label: "Label" },
                { key: "value", label: "Value" },
                { key: "sub",   label: "Sub-text" },
              ]}
              defaultItem={{ label: "", value: "", sub: "" }}
            />
            <AdminStringList label="Tech Stack Chips" items={s.techStack || []} onChange={(v) => upd("techStack", v)} placeholder="e.g. React" />
          </AdminSection>

          {/* ── MARQUEE ─────────────────────────────────────────────── */}
          <AdminSection title="📢 Marquee Banner">
            <AdminStringList
              label="Marquee Items"
              items={s.marqueeItems || []}
              onChange={(v) => upd("marqueeItems", v)}
              placeholder="e.g. Node.js"
            />
          </AdminSection>

          {/* ── STATS ───────────────────────────────────────────────── */}
          <AdminSection title="📊 Stats">
            <AdminObjectList
              label="Stat"
              items={s.stats || []}
              onChange={(v) => upd("stats", v)}
              fields={[
                { key: "value", label: "Value (e.g. 12+)" },
                { key: "label", label: "Label (e.g. PROJECTS SHIPPED)" },
              ]}
              defaultItem={{ value: "", label: "" }}
            />
          </AdminSection>

          {/* ── SERVICES ────────────────────────────────────────────── */}
          <AdminSection title="🛠 Services">
            <div className="adm-grid-2">
              <AdminInput    label="Eyebrow"     value={s.servicesEyebrow}     onChange={(v) => upd("servicesEyebrow", v)} />
              <AdminInput    label="CTA Text"    value={s.servicesCta}         onChange={(v) => upd("servicesCta", v)} />
              <AdminInput    label="CTA URL"     value={s.servicesCtaUrl}      onChange={(v) => upd("servicesCtaUrl", v)} />
            </div>
            <AdminTextarea label="Headline"    value={s.servicesHeadline}    onChange={(v) => upd("servicesHeadline", v)} rows={2} />
            <AdminTextarea label="Description" value={s.servicesDescription} onChange={(v) => upd("servicesDescription", v)} rows={2} />
            <AdminObjectList
              label="Service Card"
              items={s.services || []}
              onChange={(v) => upd("services", v)}
              fields={[
                { key: "number",   label: "Number (e.g. 01)" },
                { key: "title",    label: "Title" },
                { key: "text",     label: "Description", type: "textarea" },
                { key: "imageURL", label: "Image URL (optional)" },
              ]}
              defaultItem={{ number: "", title: "", text: "", imageURL: "" }}
            />
          </AdminSection>

          {/* ── PROJECTS SECTION INTRO ──────────────────────────────── */}
          <AdminSection title="🗂 Projects Section">
            <div className="adm-grid-2">
              <AdminInput label="Eyebrow"  value={s.projectsEyebrow}  onChange={(v) => upd("projectsEyebrow", v)} />
              <AdminInput label="CTA Text" value={s.projectsCta}      onChange={(v) => upd("projectsCta", v)} />
              <AdminInput label="CTA URL"  value={s.projectsCtaUrl}   onChange={(v) => upd("projectsCtaUrl", v)} />
            </div>
            <AdminTextarea label="Headline"    value={s.projectsHeadline}    onChange={(v) => upd("projectsHeadline", v)} rows={2} />
            <AdminTextarea label="Description" value={s.projectsDescription} onChange={(v) => upd("projectsDescription", v)} rows={2} />
            <p className="adm-hint">Individual project cards are managed in <strong>Projects</strong> tab.</p>
          </AdminSection>

          {/* ── ABOUT ───────────────────────────────────────────────── */}
          <AdminSection title="👤 About">
            <div className="adm-grid-2">
              <AdminInput label="Eyebrow"  value={s.aboutEyebrow}  onChange={(v) => upd("aboutEyebrow", v)} />
            </div>
            <AdminTextarea label="Headline"    value={s.aboutHeadline} onChange={(v) => upd("aboutHeadline", v)} rows={2} />
            <AdminTextarea label="Paragraph 1" value={s.aboutTextOne}  onChange={(v) => upd("aboutTextOne", v)}  rows={3} />
            <AdminTextarea label="Paragraph 2" value={s.aboutTextTwo}  onChange={(v) => upd("aboutTextTwo", v)}  rows={3} />
            <AboutCardsEditor cards={s.aboutCards || []} onChange={(v) => upd("aboutCards", v)} />
          </AdminSection>

          {/* ── CONTACT ─────────────────────────────────────────────── */}{/* ── CONTACT ─────────────────────────────────────────────── */}
          <AdminSection title="📬 Contact">
            <div className="adm-grid-2">
              <AdminInput label="Eyebrow"      value={s.contactEyebrow}    onChange={(v) => upd("contactEyebrow", v)} />
              <AdminInput label="Your Name"    value={s.contactName}       onChange={(v) => upd("contactName", v)} />
              <AdminInput label="Phone Number" value={s.contactPhone}      onChange={(v) => upd("contactPhone", v)} />
              <AdminInput label="Email"        value={s.contactEmail}      onChange={(v) => upd("contactEmail", v)} type="email" />
              <AdminInput label="Instagram"    value={s.contactInstagram}  onChange={(v) => upd("contactInstagram", v)} />
              <AdminInput label="GitHub"       value={s.contactGithub}     onChange={(v) => upd("contactGithub", v)} />
              <AdminInput label="Button Text"  value={s.contactButtonText} onChange={(v) => upd("contactButtonText", v)} />
            </div>
            <AdminTextarea label="Headline"    value={s.contactHeadline}    onChange={(v) => upd("contactHeadline", v)} rows={2} />
            <AdminTextarea label="Description" value={s.contactDescription} onChange={(v) => upd("contactDescription", v)} rows={2} />
            
            {/* Added dynamic custom contacts management */}
            <AdminObjectList
              label="Custom Contact"
              items={s.customContacts || []}
              onChange={(v) => upd("customContacts", v)}
              fields={[
                { key: "label", label: "Platform (e.g. Upwork, Twitter)" },
                { key: "value", label: "Display Value (e.g. @username)" },
                { key: "href",  label: "Link / Protocol (e.g. https://... or tel:91...)" },
              ]}
              defaultItem={{ label: "", value: "", href: "" }}
            />
          </AdminSection>
          
          {/* ── FOOTER ──────────────────────────────────────────────── */}
          <AdminSection title="🦶 Footer">
            <div className="adm-grid-2">
              <AdminInput label="Brand Name"    value={s.footerBrand} onChange={(v) => upd("footerBrand", v)} />
              <AdminInput label="Copyright Text" value={s.footerCopy} onChange={(v) => upd("footerCopy", v)} />
            </div>
            <AdminObjectList
              label="Footer Link"
              items={s.footerLinks || []}
              onChange={(v) => upd("footerLinks", v)}
              fields={[
                { key: "label", label: "Label" },
                { key: "href",  label: "Href" },
              ]}
              defaultItem={{ label: "", href: "" }}
            />
          </AdminSection>

          <AdminSaveBar saving={saving} message={message} />
        </form>
      </div>
    </AdminLayout>
  );
}

// ── About Cards sub-editor (cards have a tags array inside each object) ───────
function AboutCardsEditor({ cards, onChange }) {
  const add    = () => onChange([...cards, { title: "", subtitle: "", body: "", tags: [] }]);
  const remove = (i) => onChange(cards.filter((_, idx) => idx !== i));
  const upd    = (i, key, val) => onChange(cards.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
  const updTag = (i, tags) => onChange(cards.map((c, idx) => idx === i ? { ...c, tags } : c));

  return (
    <div className="adm-objlist">
      <span className="adm-label">About Cards</span>
      {cards.map((card, i) => (
        <div key={i} className="adm-objlist-card">
          <div className="adm-objlist-controls">
            <span className="adm-objlist-num">Card #{i + 1}</span>
            <button type="button" className="adm-rm" onClick={() => remove(i)}>✕</button>
          </div>
          <div className="adm-grid-2">
            <AdminInput label="Title"    value={card.title}    onChange={(v) => upd(i, "title", v)} />
            <AdminInput label="Subtitle" value={card.subtitle} onChange={(v) => upd(i, "subtitle", v)} />
          </div>
          <AdminTextarea label="Body" value={card.body} onChange={(v) => upd(i, "body", v)} rows={2} />
          {/* Tags inside each card */}
          <div className="adm-tags-editor">
            <span className="adm-label">Tags</span>
            <div className="adm-tags-row">
              {(card.tags || []).map((t, ti) => (
                <div key={ti} className="adm-tag-item">
                  <input value={t} onChange={(e) => {
                    const next = [...(card.tags || [])];
                    next[ti] = e.target.value;
                    updTag(i, next);
                  }} placeholder="tag" />
                  <button type="button" className="adm-rm" onClick={() => updTag(i, card.tags.filter((_, j) => j !== ti))}>✕</button>
                </div>
              ))}
              <button type="button" className="adm-add-tag" onClick={() => updTag(i, [...(card.tags || []), ""])}>+ Tag</button>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add About Card</button>
    </div>
  );
}
