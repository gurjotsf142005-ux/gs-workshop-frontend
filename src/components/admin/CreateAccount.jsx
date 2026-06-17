import { useState } from "react";
import { registerAdmin } from "../../services/api";
import CustomCursor from "../common/CustomCursor";

export default function CreateAccount() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerAdmin({
        username: form.username.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.message || "Registration failed.";
      if (msg.includes("Registration is closed")) {
        setClosed(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  // Registration closed (admin already exists)
  if (closed) {
    return (
      <>
        <CustomCursor />
        <main className="admin-shell admin-auth-shell">
          <div className="admin-card admin-auth-card" style={{ textAlign: "center" }}>
            <h1>Account Already Exists</h1>
            <p style={{ color: "#666", marginTop: 16, marginBottom: 24 }}>
              An admin account has already been created for this system.
            </p>
            <a href="/admin" className="admin-primary" style={{ display: "inline-block", marginTop: 12 }}>
              Go to Login
            </a>
          </div>
        </main>
      </>
    );
  }

  // Success screen
  if (success) {
    return (
      <>
        <CustomCursor />
        <main className="admin-shell admin-auth-shell">
          <div className="admin-card admin-auth-card" style={{ textAlign: "center" }}>
            <h1>✓ Account Created</h1>
            <p style={{ color: "#666", marginTop: 16, marginBottom: 24 }}>
              Your admin account has been created successfully. Log in with your credentials.
            </p>
            <a href="/admin" className="admin-primary" style={{ display: "inline-block", marginTop: 12 }}>
              Go to Login
            </a>
          </div>
        </main>
      </>
    );
  }

  // Create account form
  return (
    <>
      <CustomCursor />
      <main className="admin-shell admin-auth-shell">
        <form className="admin-card admin-auth-card" onSubmit={handleSubmit}>
          <h1>Create Admin Account</h1>
          {error && <p className="adm-error">{error}</p>}
          
          <label className="adm-field">
            <span className="adm-label">Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. admin"
              minLength="3"
              required
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              minLength="8"
              required
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Confirm Password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              minLength="8"
              required
            />
          </label>

          <button className="admin-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="adm-label" style={{ marginTop: 14, textAlign: "center" }}>
            <a href="/admin">Back to Login</a>
          </p>
        </form>
      </main>
    </>
  );
}
