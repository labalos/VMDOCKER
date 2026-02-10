import { useEffect, useState } from "react";

export default function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  // Cargar proyectos al iniciar
  useEffect(() => {
    fetch("http://192.168.1.28:3000/proyectos")
  .then(res => res.json())
  .then(data => {
    console.log("Datos recibidos del backend:", data)
    setProyectos(data)
  })
  .catch(err => console.error("Error cargando proyectos:", err))
      .catch(err => console.error("Error cargando proyectos:", err));
  }, []);

  return (
    <div>
      <h1>Lista de Proyectos</h1>

      <form
  onSubmit={async (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      titulo,
      descripcion,
      imagen,
      categoria,
      ubicacion,
      fecha
    };

    const res = await fetch("http://192.168.1.28:3000/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProyecto)
    });

    const data = await res.json();
    console.log("Proyecto creado:", data);

    // Actualizar lista
    setProyectos([...proyectos, data]);

    // Limpiar formulario
    setTitulo("");
    setDescripcion("");
    setImagen("");
    setCategoria("");
    setUbicacion("");
    setFecha("");
  }}
>
  <h2>Crear nuevo proyecto</h2>

  <input
    type="text"
    placeholder="Título"
    value={titulo}
    onChange={(e) => setTitulo(e.target.value)}
  />

  <input
    type="text"
    placeholder="Descripción"
    value={descripcion}
    onChange={(e) => setDescripcion(e.target.value)}
  />

  <input
    type="text"
    placeholder="URL de imagen"
    value={imagen}
    onChange={(e) => setImagen(e.target.value)}
  />

  <input
    type="text"
    placeholder="Categoría"
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
  />

  <input
    type="text"
    placeholder="Ubicación"
    value={ubicacion}
    onChange={(e) => setUbicacion(e.target.value)}
  />

  <input
    type="date"
    value={fecha}
    onChange={(e) => setFecha(e.target.value)}
  />

  <button type="submit">Crear proyecto</button>
</form>

      {proyectos.length === 0 && <p>No hay proyectos</p>}

      <ul>
      {proyectos.map(p => (
  <li key={p._id}>
    <h2>{p.titulo}</h2>
    <p>{p.descripcion}</p>

    <button
      onClick={async () => {
        const res = await fetch(`http://192.168.1.28:3000/proyectos/${p._id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setProyectos(proyectos.filter(proj => proj._id !== p._id));
        }
      }}
    >
      Eliminar
    </button>
  </li>
))}
  
 
</ul>
    </div>
  );
}