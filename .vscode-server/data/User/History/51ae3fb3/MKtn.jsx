import { useEffect, useState } from 'react';

export default function AdminProyectos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/admin/proyectos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then(setItems)
      .catch(() => alert('Error cargando proyectos'));
  }, []);

  return <div>{items.length} proyectos</div>;
}