const token = localStorage.getItem('token');
fetch('/api/admin/proyectos', {
  headers: { 'x-token': token },
});

fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include', // si usas cookies
})
  .then(async r => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
    // Guarda token y usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // Ejemplo: validar acceso con token
    const resp = await fetch('/api/admin/proyectos', {
      headers: { 'x-token': data.token },
    });
    if (!resp.ok) throw new Error(`Admin HTTP ${resp.status}`);

    // Redirige a dashboard
    window.location.href = '/admin';
  })
  .catch(e => {
    console.error('Login error:', e);
    setError('Credenciales inválidas');
  });
