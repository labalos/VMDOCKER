export const API_URL = '/api';

// Quitar comillas y espacios del token guardado
const t = localStorage.getItem('token') || '';
localStorage.setItem('token', t.trim().replace(/^['"]|['"]$/g, ''));

export async function fetchWithAuth(endpoint, options = {}, tkn = localStorage.getItem('token')) {
  // sanitizar token: quitar comillas y espacios
  let token = tkn ? tkn.trim().replace(/^['"]|['"]$/g, '') : '';

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}