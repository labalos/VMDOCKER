import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWithAuth('/proyectos', { method: 'GET' })
      .then(setProyectos)
      .catch(e => setError(e.message));
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto._id || proyecto.id}>
            {proyecto.titulo || proyecto.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Proyectos;
