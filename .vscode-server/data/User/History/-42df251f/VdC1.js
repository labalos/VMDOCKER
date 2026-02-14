export const API_URL = '/api';

export async function fetchWithAuth(endpoint, options = {}, tkn = localStorage.getItem('token')) {
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

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('AUTH HEADER RECIBIDO:', req.headers.authorization);

    let token = req.header('Authorization') || req.header('authorization');
    if (token?.startsWith('Bearer ')) token = token.slice(7).trim();

    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    console.error('Error auth:', e.message);
    return res.status(401).json({ error: 'invalid token' });
  }
};