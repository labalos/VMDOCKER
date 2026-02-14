import React, { useState, useEffect } from 'react';
import { getApiBase } from '../utils/apiBase';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE = getApiBase();

  useEffect(() => {
    const url = `${API_BASE}/proyectos`;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(setProyectos)
      .catch(e => setError(e.message));
  }, [API_BASE]);

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto._id || proyecto.id}>{proyecto.titulo || proyecto.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Proyectos;
