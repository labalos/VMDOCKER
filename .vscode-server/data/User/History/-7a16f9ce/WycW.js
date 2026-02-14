// Detecta si corre en navegador local (vite dev) o dentro del contenedor
export function getApiBase() {
  // Si VITE_API_BASE está definida, úsala
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;

  // Fallback: si estás en localhost, usa localhost:3001; si no, usa backend:3001 (Docker)
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const host = isLocal ? 'http://localhost:3001' : 'http://backend:3001';
  return `${host}/api`;
}