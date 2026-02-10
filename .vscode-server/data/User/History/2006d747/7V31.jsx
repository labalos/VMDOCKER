import { useEffect, useState } from "react";

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([]);

  // Cargar proyectos al iniciar
  useEffect(() => {
    fetch("http://192.168.1.28:3000/proyectos")
      .then(res => res.json())
      .then(data => setProyectos(data))
      .catch(err => console.error("Error cargando proyectos:", err));
  }, []);

  return (
    <div>
      <h1>Lista de Proyectos</h1>

      {proyectos.length === 0 && <p>No hay proyectos</p>}

      <ul>
        {proyectos.map(p => (
          <li key={p._id}>
            <strong>{p.titulo}</strong> — {p.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}