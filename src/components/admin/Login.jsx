// WHY THIS FILE WAS BROKEN:
// Login.jsx exported a component named "Dashboard" that rendered admin settings
// forms — not a login form. It was likely an old copy that was never cleaned up.
// This is the real login form that matches your auth flow.

import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Handle account locked (423) separately for a better message
        if (res.status === 423) {
          setError("Account temporarily locked due to too many failed attempts. Try again in 2 hours.");
        } else {
          setError(data.error || "Login failed.");
        }
        return;
      }

      // Store token and notify parent (Admin.jsx) so it can re-render the dashboard
      localStorage.setItem("adminToken", data.token);
      if (onLogin) onLogin(data.token);
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-shell admin-auth-shell">
      <form className="admin-card admin-auth-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>

        {error && <p className="adm-error">{error}</p>}

        <label className="adm-field">
          <span className="adm-label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="adm-field">
          <span className="adm-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </label>

        <button className="admin-primary" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </button>

        <p className="adm-label" style={{ marginTop: 14, textAlign: "center" }}>
          <a href="/admin/register">Create admin account</a>
        </p>
      </form>
    </main>
  );
}