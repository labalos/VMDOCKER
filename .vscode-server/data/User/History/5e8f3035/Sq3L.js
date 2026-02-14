import { getApiBase } from './apiBase';

export const API_URL = getApiBase();

export async function fetchWithAuth(endpoint, options = {}, token) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { "x-token": token }),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { msg = (await res.json()).message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}