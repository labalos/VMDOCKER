import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Error de login');
    localStorage.setItem('token', data.token);
    window.location.href = '/admin';
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
