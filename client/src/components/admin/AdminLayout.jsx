export default function AdminLayout({ children, onLogout }) {
  function go(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="asl-brand">GS</span>
          <span className="asl-sub">Dashboard</span>
        </div>
        <nav className="admin-sidebar-nav">
          <button onClick={() => go("/admin")}>📊 Overview</button>
          <button onClick={() => go("/admin/projects")}>🗂 Projects</button>
          <button onClick={() => go("/admin/settings")}>⚙️ Settings</button>
        </nav>
        <button className="admin-logout-btn" onClick={() => {
          localStorage.removeItem("adminToken");
          if (onLogout) onLogout(); else window.location.href = "/";
        }}>
          ← Logout
        </button>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
