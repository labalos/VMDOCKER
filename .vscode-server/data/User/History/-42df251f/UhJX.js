export const API_URL = '/api';

export async function fetchWithAuth(endpoint, options = {}, tkn = localStorage.getItem('token')) {
  const token = (tkn || '').trim().replace(/^['"]|['"]$/g, '');
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const url = isAbsolute ? endpoint : `${API_URL}${endpoint}`;

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}