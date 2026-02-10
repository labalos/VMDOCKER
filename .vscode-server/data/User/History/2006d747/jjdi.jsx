import { useEffect, useState } from "react";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    async function cargarProyectos() {
      try {
        const respuesta = await fetch("http://192.168.1.28:3000/proyectos");
        const data = await respuesta.json();
        setProyectos(data);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    }

    cargarProyectos();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-500">
          Lista de Proyectos
      </h1>

      <ul>
        {proyectos.map((p) => (
          <li key={p._id}>
            <strong>{p.titulo}</strong> — {p.ubicacion} — {p.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Proyectos;