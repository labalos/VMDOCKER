// Detecta si corre en navegador local (vite dev) o dentro del contenedor
export function getApiBase() {
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const host = isLocal ? 'http://localhost:3001' : 'http://backend:3001';
  return `${host}/api`;
}