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
export const getPublicProjects = (query = {}) => {
  // WHY URLSearchParams: converts { limit: 12 } → "?limit=12"
  // Without this, passing an object gives /api/projects[object Object]
  const qs = new URLSearchParams(query).toString();
  return request(`/projects${qs ? "?" + qs : ""}`);
};

export const getSiteSettings = () => request("/settings");

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerAdmin = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginAdmin = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

export const getMe = () => request("/auth/me");

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
export const getSettings = () => request("/admin/settings");

export const updateSettings = (body) =>
  request("/admin/settings", { method: "PUT", body: JSON.stringify(body) });