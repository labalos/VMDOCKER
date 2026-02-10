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
    <div className="min-h-screen bg-green-500 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Lista de Proyectos
      </h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">{p.titulo}</h2>
            <p className="text-gray-600">{p.ubicacion}</p>
            <p className="text-sm text-gray-500">{p.categoria}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proyectos;