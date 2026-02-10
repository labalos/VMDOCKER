import { useEffect, useState } from "react";

export default function Home() {

  console.log("SE ESTÁ RENDERIZANDO HOME.JSX");

  const token = localStorage.getItem("token");

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

  const [editImagenes, setEditImagenes] = useState([]);

  const agregarInputImagen = () => {
    setEditImagenes([...editImagenes, ""]);
  };

  const actualizarImagen = (index, valor) => {
    const nuevas = [...editImagenes];
    nuevas[index] = valor;
    setEditImagenes(nuevas);
  };

  const eliminarImagen = (index) => {
    const nuevas = editImagenes.filter((_, i) => i !== index);
    setEditImagenes(nuevas);
  };

  const handleSubirArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    try {
      const formData = new FormData();
      formData.append("imagen", archivo);

      const res = await fetch("http://192.168.1.28:3000/upload", {
        method: "POST",
        headers: {
          "x-token": token
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error al subir archivo: " + JSON.stringify(data));
        return;
      }

      setEditImagenes([...editImagenes, data.url]);
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      alert("Error al subir archivo");
    }
  };

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
      headers: {
        "Content-Type": "application/json",
        "x-token": token
      },
      body: JSON.stringify(nuevoProyecto)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error al crear proyecto: " + JSON.stringify(data));
      return;
    }

    setProyectos([...proyectos, data]);

    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setUbicacion("");

    setMostrarFormulario(false);
  };

  const handleEliminarProyecto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;

    const res = await fetch(`http://192.168.1.28:3000/proyectos/${id}`, {
      method: "DELETE",
      headers: {
        "x-token": token
      }
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

    setEditImagenes(proyecto.imagenes || []);

    setMostrarModalEditar(true);
  };

  const handleEditarProyecto = async () => {
    if (!proyectoEditando) return;

    try {
      const proyectoActualizado = {
        titulo: editTitulo,
        descripcion: editDescripcion,
        categoria: editCategoria,
        ubicacion: editUbicacion,
        imagenes: editImagenes.filter((img) => img.trim() !== ""),
      };

      const res = await fetch(
        `http://192.168.1.28:3000/proyectos/${proyectoEditando._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-token": token
          },
          body: JSON.stringify(proyectoActualizado),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Error al editar proyecto: " + JSON.stringify(data));
        return;
      }

      setProyectos(
        proyectos.map((p) => (p._id === proyectoEditando._id ? data : p))
      );

      setMostrarModalEditar(false);
    } catch (error) {
      console.error("Error editando proyecto:", error);
      alert("Error al editar proyecto");
    }
  };

  return (
    <div className="container py-5">

      {token && (
        <button
          className="btn btn-danger mb-4"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      )}

      <h1 className="text-center text-primary mb-4">Lista de Proyectos</h1>

      {token && (
        <button
          className="btn btn-success mb-4"
          onClick={() => setMostrarFormulario(true)}
        >
          Crear Proyecto
        </button>
      )}

      {mostrarFormulario && token && (
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

                <input
                  type="file"
                  name="imagen"
                  className="form-control mb-3"
                  onChange={handleSubirArchivo}
                  disabled={!token}
                />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Título"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  disabled={!token}
                />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Descripción"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  disabled={!token}
                />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Categoría"
                  value={editCategoria}
                  onChange={(e) => setEditCategoria(e.target.value)}
                  disabled={!token}
                />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ubicación"
                  value={editUbicacion}
                  onChange={(e) => setEditUbicacion(e.target.value)}
                  disabled={!token}
                />

                {(() => {
                  const imagenesCarrusel = Array.from(
                    new Set([...(proyectoEditando?.imagenes || []), ...editImagenes])
                  ).filter((img) => img && img.trim() !== "");

                  if (imagenesCarrusel.length === 0) return null;

                  return (
                    <div id="carouselEditar" className="carousel slide mb-4" data-bs-ride="carousel">

                      <div className="carousel-indicators">
                        {imagenesCarrusel.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            data-bs-target="#carouselEditar"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                          ></button>
                        ))}
                      </div>

                      <div className="carousel-inner">
                        {imagenesCarrusel.map((img, index) => (
                          <div
                            key={index}
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                          >
                            <img
                              src={img}
                              className="d-block w-100"
                              style={{ maxHeight: "300px", objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselEditar"
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon"></span>
                      </button>

                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselEditar"
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon"></span>
                      </button>

                    </div>
                  );
                })()}

                <div className="mb-3">
                  <label className="form-label fw-bold">Imágenes del proyecto</label>

                  {editImagenes.map((img, index) => (
                    <div key={index} className="d-flex mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="URL de imagen"
                        value={img}
                        onChange={(e) => actualizarImagen(index, e.target.value)}
                        disabled={!token}
                      />
                      {token && (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => eliminarImagen(index)}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}

                  {token && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={agregarInputImagen}
                    >
                      + Agregar otra imagen
                    </button>
                  )}
                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModalEditar(false)}
                >
                  Cancelar
                </button>

                {token && (
                  <button
                    className="btn btn-primary"
                    onClick={handleEditarProyecto}
                  >
                    Guardar cambios
                  </button>
                )}
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

                {token && (
                  <>
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
                  </>
                )}

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}