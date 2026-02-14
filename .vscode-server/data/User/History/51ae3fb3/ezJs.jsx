import { useEffect, useState } from 'react';

export default function AdminProyectos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchProyectos() {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/proyectos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setItems(data);
    }

    fetchProyectos().catch(() => alert('Error cargando proyectos'));
  }, []);

  return <div>{items.length} proyectos</div>;
}