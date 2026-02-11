import React, { useState, useEffect } from 'react';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = '/api/proyectos'; // con proxy; sin proxy usa 'http://localhost:3001/api/proyectos'
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        // Si tu backend devuelve { items, total, ... }:
        const data = await r.json();
        const proyectos = Array.isArray(data) ? data : data.items;
        setProyectos(proyectos);
      })
      .catch((e) => {
        console.error('Error cargando proyectos:', e);
        setError('No se pudieron cargar los proyectos');
      });
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto.id}>{proyecto.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Proyectos;
