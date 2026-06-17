import { useEffect, useState } from "react";
import CustomCursor from "../components/common/CustomCursor";
import Dashboard from "../components/admin/Dashboard";
import Projects  from "../components/admin/Projects";
import Settings  from "../components/admin/Settings";
import { loginAdmin, getSettings, updateSettings } from "../services/api";

export default function Admin({ setToken }) {
  const [localToken, setLocalToken] = useState(() => localStorage.getItem("adminToken"));
  const [authForm, setAuthForm]     = useState({ email: "", password: "" });
  const [error, setError]           = useState("");
  const [path, setPath]             = useState(window.location.pathname);
  const [settings, setSettings]     = useState(null);
  const [message, setMessage]       = useState("");
  const [saving, setSaving]         = useState(false);

  // sync path on navigation
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // load settings when logged in
  useEffect(() => {
    if (!localToken) return;
    getSettings()
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, [localToken]);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await loginAdmin({ email: authForm.email.toLowerCase().trim(), password: authForm.password });
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
        setLocalToken(data.token);
      }
    } catch {
      setError("Invalid email or password.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setToken(null);
    setLocalToken(null);
    setSettings(null);
  }

  async function handleUpdateSettings(payload) {
    setSaving(true);
    try {
      const d = await updateSettings(payload);
      setSettings(d.settings);
      setMessage("✓ Saved!");
    } catch {
      setMessage("Error saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  }

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!localToken) {
    return (
      <>
        <CustomCursor />
        <main className="admin-shell admin-auth-shell">
          <form className="admin-card admin-auth-card" onSubmit={handleAuth}>
            <h1>Admin Login</h1>
            {error && <p className="adm-error">{error}</p>}
            <label className="adm-field">
              <span className="adm-label">Email</span>
              <input type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} required />
            </label>
            <label className="adm-field">
              <span className="adm-label">Password</span>
              <input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} required />
            </label>
            <button className="admin-primary" type="submit">Login</button>
          </form>
        </main>
      </>
    );
  }

  // ── Route to correct admin page ─────────────────────────────────────────────
  return (
    <>
      <CustomCursor />
      {path.startsWith("/admin/projects") ? (
        <Projects onLogout={handleLogout} />
      ) : path.startsWith("/admin/settings") ? (
        <Settings onLogout={handleLogout} />
      ) : (
        <Dashboard
          settings={settings}
          setSettings={setSettings}
          updateSettings={handleUpdateSettings}
          message={message}
          saving={saving}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}