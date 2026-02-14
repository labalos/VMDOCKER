import React, { useState, useEffect } from 'react';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE}/proyectos`;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(setProyectos)
      .catch(e => alert(e.message));
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
