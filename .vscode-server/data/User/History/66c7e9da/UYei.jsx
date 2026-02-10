import { useEffect, useState } from "react";

function App() {
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

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editCategoria, setEditCategoria] = useState("");
  const [editUbicacion, setEditUbicacion] = useState("");

  const handleCrearProyecto = async (e) => {
    e.preventDefault();
  
    const nuevoProyecto = {
      titulo,
      descripcion,
      categoria,
      ubicacion
    };
  
    const res = await fetch("http://192.168.1.28:3000/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProyecto)
    });


    
    console.log("STATUS:", res.status);

    const data = await res.json();
  
    console.log("RESPUESTA DEL BACKEND:", data);
    if (!res.ok) {
      alert("Error al crear proyecto: " + JSON.stringify(data));
      return;
    }
  
    

    // Actualizar la lista sin recargar
    setProyectos([...proyectos, data]);
  
    // Limpiar formulario
    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setUbicacion("");
  
    // Ocultar formulario
    setMostrarFormulario(false);
  };

  const handleEliminarProyecto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
  
    const res = await fetch(`http://192.168.1.28:3000/proyectos/${id}`, {
      method: "DELETE"
    });
  
    if (res.ok) {
      setProyectos(proyectos.filter((p) => p._id !== id));
    } else {
      alert("Error al eliminar el proyecto");
    }
  };

  const abrirModalEditar = (proyecto) => {
    setProyectoEditando(proyecto);
  
    setEditTitulo(proyecto.titulo);
    setEditDescripcion(proyecto.descripcion);
    setEditCategoria(proyecto.categoria);
    setEditUbicacion(proyecto.ubicacion);
  
    setMostrarModalEditar(true);
  };

  return (
  <div className="container py-5">
    <h1 className="text-center text-primary mb-4">Lista de Proyectos</h1>

    <button className="btn btn-success mb-4" onClick={() => setMostrarFormulario(true)}>
        Crear Proyecto
    </button>

    {mostrarFormulario && (
  <form className="card card-body mb-4" onSubmit={handleCrearProyecto}>
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Título"
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
      required
    />

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Descripción"
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      required
    />

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Categoría"
      value={categoria}
      onChange={(e) => setCategoria(e.target.value)}
    />

    <input
      type="text"
      className="form-control mb-2"
      placeholder="Ubicación"
      value={ubicacion}
      onChange={(e) => setUbicacion(e.target.value)}
    />

    <button className="btn btn-primary">Guardar</button>
  </form>
  
)}



{mostrarModalEditar && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">

        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">Editar Proyecto</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMostrarModalEditar(false)}
          ></button>
        </div>

        <div className="modal-body">
          <p>
          <div className="modal-body">
         <input
          type="text"
          className="form-control mb-2"
          placeholder="Título"
          value={editTitulo}
          onChange={(e) => setEditTitulo(e.target.value)}
        />

            <input
              type="text"
              className="form-control mb-2"
               placeholder="Descripción"
               value={editDescripcion}
               onChange={(e) => setEditDescripcion(e.target.value)}
            />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Categoría"
          value={editCategoria}
          onChange={(e) => setEditCategoria(e.target.value)}
       />

       <input
            type="text"
            className="form-control mb-2"
            placeholder="Ubicación"
            value={editUbicacion}
            onChange={(e) => setEditUbicacion(e.target.value)}
        />
            </div>
          </p>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={() => setMostrarModalEditar(false)}
          >
            Cancelar
          </button>
          <button className="btn btn-primary">
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  </div>
)}


    <div className="row">
      {proyectos.map((p) => (
        <div key={p._id} className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">

            <div className="card-body">
              <h5 className="card-title">{p.titulo}</h5>
              <p className="card-text">
                <strong>Ubicación:</strong> {p.ubicacion} <br />
                <strong>Categoría:</strong> {p.categoria}
              </p>

              <button 
               className="btn btn-warning btn-sm me-2"
               onClick={() => abrirModalEditar(p)}
              >
               Editar
              </button>
              
              <button 
                 className="btn btn-danger btn-sm"
                 onClick={() => handleEliminarProyecto(p._id)}
              >
                 Eliminar
              </button>

            </div>

          </div>
        </div>
      ))}
    </div>

   </div>
);

}

export default App;
