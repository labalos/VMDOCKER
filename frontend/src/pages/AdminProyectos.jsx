import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../helpers/fetchWithAuth';

export default function AdminProyectos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWithAuth('/admin/proyectos', { method: 'GET' })
      .then(setItems)
      .catch(e => alert(e.message));
  }, []);

  return <div>{items.length} proyectos</div>;
}