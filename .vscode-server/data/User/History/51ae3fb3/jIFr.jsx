import { useEffect, useState } from 'react';

export default function AdminProyectos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchProyectos() {
      const token = localStorage.getItem('token');
      if (!token) return alert('No hay token. Inicia sesión.');

      const res = await fetch('/api/admin/proyectos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err.error || `Error ${res.status}`);
      }

      const data = await res.json();
      setItems(data);
    }

    fetchProyectos().catch(() => alert('Error cargando proyectos'));
  }, []);

  return <div>{items.length} proyectos</div>;
}