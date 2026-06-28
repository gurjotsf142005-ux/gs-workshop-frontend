import { useState, useEffect } from "react";
import Home          from "./pages/Home";
import Admin         from "./pages/Admin";
import CreateAccount from "./pages/admin/CreateAccount";

// WHY THIS MATTERS:
// Original App.jsx checked window.location.pathname directly in render.
// This works on first load but breaks on back/forward navigation — the
// component doesn't re-render when the URL changes via pushState, so the
// wrong page stays on screen.
//
// We listen to the popstate event (fired by pushState AND browser back/forward)
// and store the path in state so any URL change triggers a re-render.

function getPath() {
  return window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    // Listen for pushState navigation (AdminLayout uses this)
    // AND browser back/forward button
    function onNavigate() { setPath(getPath()); }
    window.addEventListener("popstate", onNavigate);
    return () => window.removeEventListener("popstate", onNavigate);
  }, []);

  // Route: /admin/register → CreateAccount
  if (path === "/admin/register") {
    return <CreateAccount />;
  }

  // Route: /admin or /admin/* → Admin panel
  if (path.startsWith("/admin")) {
    return <Admin />;
  }

  // Route: everything else → public site
  return <Home />;
}