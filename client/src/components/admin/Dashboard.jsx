import AdminLayout from "./AdminLayout";
import { AdminInput, AdminSaveBar } from "./AdminHelpers";

export default function Dashboard({ settings, setSettings, updateSettings, message, saving, onLogout }) {

  const handleStatChange = (i, field, val) => {
    const stats = settings.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : { ...s });
    setSettings({ ...settings, stats });
  };

  async function handleSave(e) {
    e.preventDefault();
    await updateSettings(settings);
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1 className="adm-page-title">Overview</h1>
          <p className="adm-page-sub">Quick edit your stats and hero — full control in Settings.</p>
        </div>

        {settings && (
          <form onSubmit={handleSave}>
            <div className="adm-two-col">

              {/* Stats quick-edit */}
              <div className="admin-card">
                <h2 className="adm-card-title">Homepage Stats</h2>
                {(settings.stats || []).map((stat, i) => (
                  <div key={i} className="adm-stat-row">
                    <AdminInput label={`#${i + 1} Value`} value={stat.value} onChange={(v) => handleStatChange(i, "value", v)} />
                    <AdminInput label="Label" value={stat.label} onChange={(v) => handleStatChange(i, "label", v)} />
                  </div>
                ))}
              </div>

              {/* Hero quick-edit */}
              <div className="admin-card">
                <h2 className="adm-card-title">Hero Snapshot</h2>
                <AdminInput label="Headline" value={settings.heroHeadline || ""} onChange={(v) => setSettings({ ...settings, heroHeadline: v })} />
                <AdminInput label="CTA — Primary" value={settings.heroPrimaryCta || ""} onChange={(v) => setSettings({ ...settings, heroPrimaryCta: v })} />
                <AdminInput label="CTA — Secondary" value={settings.heroSecondaryCta || ""} onChange={(v) => setSettings({ ...settings, heroSecondaryCta: v })} />
                <p className="adm-hint">For full hero control go to <strong>Settings → Hero</strong>.</p>
              </div>
            </div>

            <AdminSaveBar saving={saving} message={message} />
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
