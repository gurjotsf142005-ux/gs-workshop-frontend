import { useState } from "react";
import CustomCursor from "../common/CustomCursor";
import { registerAdmin } from "../../services/api";

// One-time admin account creation screen.
// The backend (Admin.countDocuments() check in authController.js) is what
// actually enforces "only one account" — this component just gives that
// rule a proper UI instead of a raw fetch() in the browser console.
export default function CreateAccount() {
  const [form, setForm]               = useState({ username: "", email: "", password: "" });
  const [confirmPassword, setConfirm]  = useState("");
  const [error, setError]              = useState("");
  const [status, setStatus]            = useState("idle"); // idle | submitting | success | closed

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password should be at least 8 characters.");
      return;
    }

    setStatus("submitting");
    try {
      await registerAdmin({
        username: form.username.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      setStatus("success");
    } catch (err) {
      if (err.message === "Registration is closed.") {
        setStatus("closed");
      } else {
        setError(err.message || "Something went wrong.");
        setStatus("idle");
      }
    }
  }

  if (status === "closed") {
    return (
      <>
        <CustomCursor />
        <main className="admin-shell admin-auth-shell">
          <div className="admin-card admin-auth-card">
            <h1>Account already exists</h1>
            <p className="adm-label">
              An admin account has already been created for this site. Only
              one account is allowed.
            </p>
            <a className="admin-primary" href="/admin">Go to login</a>
          </div>
        </main>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <CustomCursor />
        <main className="admin-shell admin-auth-shell">
          <div className="admin-card admin-auth-card">
            <h1>Account created</h1>
            <p className="adm-label">
              Log in with the email and password you just chose.
            </p>
            <a className="admin-primary" href="/admin">Go to login</a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <main className="admin-shell admin-auth-shell">
        <form className="admin-card admin-auth-card" onSubmit={handleSubmit}>
          <h1>Create Admin Account</h1>
          <p className="adm-label" style={{ marginBottom: 12 }}>
            This can only be done once.
          </p>
          {error && <p className="adm-error">{error}</p>}

          <label className="adm-field">
            <span className="adm-label">Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <label className="adm-field">
            <span className="adm-label">Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <button className="admin-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Creating account…" : "Create account"}
          </button>
        </form>
      </main>
    </>
  );
}