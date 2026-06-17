const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

function auth() {
  const t = localStorage.getItem('adminToken');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ── Public ───────────────────────────────────────────────────────────────────
export const getPublicProjects = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/projects${q ? `?${q}` : ''}`);
};
export const getPublicSettings = () => request('/settings');

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginAdmin    = (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) });
export const registerAdmin = (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) });

// ── Admin ────────────────────────────────────────────────────────────────────
export const getAllProjects  = ()         => request('/admin/projects',      { headers: auth() });
export const createProject  = (body)     => request('/admin/projects',      { method: 'POST',   headers: auth(), body: JSON.stringify(body) });
export const updateProject  = (id, body) => request(`/admin/projects/${id}`,{ method: 'PUT',    headers: auth(), body: JSON.stringify(body) });
export const deleteProject  = (id)       => request(`/admin/projects/${id}`,{ method: 'DELETE', headers: auth() });
export const getSettings    = ()         => request('/admin/settings',      { headers: auth() });
export const updateSettings = (body)     => request('/admin/settings',      { method: 'PUT',    headers: auth(), body: JSON.stringify(body) });
