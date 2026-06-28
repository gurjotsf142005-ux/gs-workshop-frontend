// All API calls go through here.
// WHY a central request() function:
//   - Token injection in one place — never forget Authorization header on a new route
//   - Error handling in one place — every non-OK response throws with the server's message
//   - Base URL in one place — change VITE_API_URL in .env and everything updates

const API = import.meta.env.VITE_API_URL || "https://gs-workshop.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

// ── Public ────────────────────────────────────────────────────────────────────
export const getPublicProjects = (params = "") =>
  request(`/projects${params}`);

export const getSiteSettings = () =>
  request("/settings");

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerAdmin = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginAdmin = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const getMe = () =>
  request("/auth/me");

// ── Admin — Projects ──────────────────────────────────────────────────────────
export const getAllProjects = () =>
  request("/admin/projects");

export const createProject = (body) =>
  request("/admin/projects", { method: "POST", body: JSON.stringify(body) });

export const updateProject = (id, body) =>
  request(`/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteProject = (id) =>
  request(`/admin/projects/${id}`, { method: "DELETE" });

// ── Admin — Settings ──────────────────────────────────────────────────────────
export const getSettings = () =>
  request("/admin/settings");

export const updateSettings = (body) =>
  request("/admin/settings", { method: "PUT", body: JSON.stringify(body) });