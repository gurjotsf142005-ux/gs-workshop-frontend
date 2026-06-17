import { AdminInput, AdminTextarea } from "./AdminHelpers"; // Create a helper file or define them here

export default function Dashboard({ settings, setSettings, projects, projectForm, setProjectForm, handleProjectSave, editingId, setEditingId, setMessage, updateSettings, deleteProject, loadAdminData }) {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <h1>Dashboard</h1>
        <button className="admin-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
      </header>

      {settings && (
        <section className="admin-grid">
          {/* Hero Form */}
          <form className="admin-card" onSubmit={async (e) => { e.preventDefault(); await updateSettings(settings); setMessage("Hero updated!"); }}>
            <h2>Hero Settings</h2>
            <AdminInput label="Headline" value={settings.heroHeadline} onChange={v => setSettings({ ...settings, heroHeadline: v })} />
            <AdminInput label="Hero Image URL" value={settings.heroImage || ""} onChange={v => setSettings({ ...settings, heroImage: v })} />
            <button className="admin-primary" type="submit">Save Hero</button>
          </form>

          {/* Contact Form */}
          <form className="admin-card" onSubmit={async (e) => { e.preventDefault(); await updateSettings(settings); setMessage("Contact updated!"); }}>
            <h2>Contact Settings</h2>
            <AdminInput label="Email" value={settings.contactEmail} onChange={v => setSettings({ ...settings, contactEmail: v })} />
            <button className="admin-primary" type="submit">Save Contact</button>
          </form>
        </section>
      )}
    </main>
  );
}