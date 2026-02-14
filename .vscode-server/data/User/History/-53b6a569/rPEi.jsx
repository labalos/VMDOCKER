import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_BASE;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Credenciales incorrectas');
        return;
      }
      localStorage.setItem('token', data.token); // token crudo
      window.location.href = '/admin/proyectos';
    } catch (err) {
      alert('No se pudo conectar al servidor');
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '80px auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
