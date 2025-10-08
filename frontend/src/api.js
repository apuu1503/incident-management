const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  const resp = await fetch(url, { ...options, headers });
  return resp.json();
}
