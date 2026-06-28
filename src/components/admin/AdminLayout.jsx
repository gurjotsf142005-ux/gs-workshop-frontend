// WHY THIS FILE MATTERS FOR SPEED:
// AdminLayout wraps every admin page. The navigation here uses pushState
// which changes the URL without a full page reload — no white flash, no
// re-fetching CSS/JS bundles, no re-mounting the React tree from scratch.
// It's the difference between SPA navigation (~0ms) and full reload (~1-3s).

export default function AdminLayout({ children, onLogout }) {
  function go(path) {
    window.history.pushState({}, "", path);
    // pushState doesn't fire popstate automatically — we dispatch it manually
    // so App.jsx's useEffect listener re-evaluates the current path and
    // renders the correct page component.
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    // Use location.href for logout — we WANT a full reload to clear any
    // in-memory cached state (admin object, settings cache, etc.)
    if (onLogout) onLogout();
    else window.location.href = "/admin";
  }

  // Highlight active nav item
  const path = window.location.pathname;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="asl-brand">GS</span>
          <span className="asl-sub">Dashboard</span>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            onClick={() => go("/admin")}
            className={path === "/admin" ? "is-active" : ""}
          >
            📊 Overview
          </button>
          <button
            onClick={() => go("/admin/projects")}
            className={path === "/admin/projects" ? "is-active" : ""}
          >
            🗂 Projects
          </button>
          <button
            onClick={() => go("/admin/settings")}
            className={path === "/admin/settings" ? "is-active" : ""}
          >
            ⚙️ Settings
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          ← Logout
        </button>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}