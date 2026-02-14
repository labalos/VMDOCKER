import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);

      // Guarda token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Validar acceso admin usando el token
      const resp = await fetch('/api/admin/proyectos', {
        headers: { 'x-token': data.token },
      });
      if (!resp.ok) throw new Error(`Admin HTTP ${resp.status}`);

      // Redirige a dashboard
      window.location.href = '/admin';
    } catch (e) {
      console.error('Login error:', e);
      setError('Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Ingresar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
