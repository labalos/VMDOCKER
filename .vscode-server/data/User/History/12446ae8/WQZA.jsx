import { useEffect, useState, useCallback, useMemo } from "react";

// ==========================================
// CONFIGURACIÓN - Ajusta según tu .env
// ==========================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ==========================================
// UTILIDADES
// ==========================================

const fetchWithAuth = async (endpoint, options = {}, token) => {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { "x-token": token }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
};

// ==========================================
// CUSTOM HOOKS
// ==========================================

const useForm = (initial) => {
  const [values, setValues] = useState(initial);
  
  const handleChange = useCallback((field) => (e) => {
    setValues(p => ({ ...p, [field]: e.target.value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);
  const setAll = useCallback((v) => setValues(v), []);
  
  return { values, handleChange, reset, setAll };
};

const useImageList = (initial = []) => {
  const [images, setImages] = useState(initial);
  
  return {
    images,
    setImages,
    add: useCallback(() => setImages(p => [...p, ""]), []),
    update: useCallback((i, v) => setImages(p => p.map((img, idx) => idx === i ? v : img)), []),
    remove: useCallback((i) => setImages(p => p.filter((_, idx) => idx !== i)), []),
    append: useCallback((url) => setImages(p => [...p, url]), []),
  };
};

const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/proyectos");
      setProyectos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error cargando proyectos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return { proyectos, setProyectos, loading, error, recargar: cargar };
};

// ==========================================
// SUB-COMPONENTES
// ==========================================

const FormField = ({ name, value, onChange, required, disabled }) => (
  <input
    type="text"
    className="form-control mb-2"
    placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
  />
);

const Carrusel = ({ imagenes }) => {
  if (!imagenes?.length) return null;
  
  return (
    <div id="carouselEditar" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {imagenes.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselEditar"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {imagenes.map((img, i) => (
          <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <img
              src={img}
              className="d-block w-100"
              style={{ maxHeight: "300px", objectFit: "cover" }}
              alt={`Imagen ${i + 1}`}
            />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselEditar" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselEditar" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function Home() {
  const token = localStorage.getItem("token");
  const { proyectos, setProyectos, loading, error, recargar } = useProyectos();

  // DEBUG - Eliminar después
  console.log("Token:", token);
  console.log("¿Hay token?", !!token);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  const formCrear = useForm({ titulo: "", descripcion: "", categoria: "", ubicacion: "" });
  const formEditar = useForm({ titulo: "", descripcion: "", categoria: "", ubicacion: "" });
  const imagenes = useImageList();

  // Handlers CRUD
  const handleCrear = useCallback(async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const nuevo = await fetchWithAuth("/proyectos", {
        method: "POST",
        body: JSON.stringify(formCrear.values),
      }, token);
      
      setProyectos(p => [...p, nuevo]);
      formCrear.reset();
      setMostrarFormulario(false);
    } catch (err) {
      alert("Error al crear: " + err.message);
    }
  }, [token, formCrear, setProyectos]);

  const handleEliminar = useCallback(async (id) => {
    if (!token || !confirm("¿Eliminar este proyecto?")) return;

    try {
      await fetchWithAuth(`/proyectos/${id}`, { method: "DELETE" }, token);
      setProyectos(p => p.filter(x => x._id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }, [token, setProyectos]);

  const abrirEditar = useCallback((p) => {
    setProyectoEditando(p);
    formEditar.setAll({
      titulo: p.titulo,
      descripcion: p.descripcion,
      categoria: p.categoria,
      ubicacion: p.ubicacion,
    });
    imagenes.setImages(p.imagenes || []);
    setModalAbierto(true);
  }, [formEditar, imagenes]);

  const handleEditar = useCallback(async () => {
    if (!proyectoEditando || !token) return;

    const payload = {
      ...formEditar.values,
      imagenes: imagenes.images.filter(x => x.trim()),
    };

    try {
      const actualizado = await fetchWithAuth(
        `/proyectos/${proyectoEditando._id}`,
        { method: "PUT", body: JSON.stringify(payload) },
        token
      );
      
      setProyectos(p => p.map(x => x._id === proyectoEditando._id ? actualizado : x));
      setModalAbierto(false);
      setProyectoEditando(null);
    } catch (err) {
      alert("Error al editar: " + err.message);
    }
  }, [proyectoEditando, token, formEditar.values, imagenes.images, setProyectos]);

  const handleSubirImagen = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const { url } = await fetchWithAuth("/upload", {
        method: "POST",
        body: formData,
      }, token);
      
      imagenes.append(url);
    } catch (err) {
      alert("Error al subir imagen: " + err.message);
    }
  }, [token, imagenes]);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setProyectoEditando(null);
  }, []);

  // Computed
  const campos = useMemo(() => [
    { name: "titulo", required: true },
    { name: "descripcion", required: true },
    { name: "categoria", required: false },
    { name: "ubicacion", required: false },
  ], []);

  const imagenesCarrusel = useMemo(() => {
    if (!modalAbierto || !proyectoEditando) return [];
    return [...new Set([...(proyectoEditando.imagenes || []), ...imagenes.images])].filter(Boolean);
  }, [modalAbierto, proyectoEditando, imagenes.images]);

  // Render
  if (loading) return <div className="container py-5 text-center">Cargando...</div>;
  if (error) return <div className="container py-5 alert alert-danger">Error: {error}</div>;

  return (
    <div className="container py-5">
      {token && (
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <button className="btn btn-outline-primary" onClick={recargar}>
            ↻ Recargar
          </button>
        </div>
      )}

      <h1 className="text-center text-primary mb-4">Lista de Proyectos</h1>

      {token && (
        <button
          className={`btn mb-4 ${mostrarFormulario ? "btn-secondary" : "btn-success"}`}
          onClick={() => setMostrarFormulario(v => !v)}
        >
          {mostrarFormulario ? "Cancelar" : "Crear Proyecto"}
        </button>
      )}

      {/* Formulario Crear */}
      {mostrarFormulario && token && (
        <form className="card card-body mb-4 shadow-sm" onSubmit={handleCrear}>
          {campos.map(({ name, required }) => (
            <FormField
              key={name}
              name={name}
              value={formCrear.values[name]}
              onChange={formCrear.handleChange(name)}
              required={required}
            />
          ))}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Guardar</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Modal Editar */}
      {modalAbierto && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Editar Proyecto</h5>
                <button type="button" className="btn-close btn-close-white" onClick={cerrarModal} />
              </div>

              <div className="modal-body">
                {token && (
                  <div className="mb-3">
                    <label className="form-label">Subir nueva imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleSubirImagen}
                    />
                  </div>
                )}

                {campos.map(({ name, required }) => (
                  <FormField
                    key={name}
                    name={name}
                    value={formEditar.values[name]}
                    onChange={formEditar.handleChange(name)}
                    required={required}
                    disabled={!token}
                  />
                ))}

                <Carrusel imagenes={imagenesCarrusel} />

                <div className="mb-3">
                  <label className="form-label fw-bold">URLs de imágenes</label>
                  {imagenes.images.map((img, i) => (
                    <div key={i} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={img}
                        onChange={(e) => imagenes.update(i, e.target.value)}
                        disabled={!token}
                        placeholder="https://..."
                      />
                      {token && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => imagenes.remove(i)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {token && (
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={imagenes.add}>
                      + Agregar URL
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
                {token && <button className="btn btn-primary" onClick={handleEditar}>Guardar cambios</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Proyectos */}
      <div className="row">
        {proyectos.map(p => (
          <div key={p._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.titulo}</h5>
                <p className="card-text flex-grow-1">
                  <strong>Ubicación:</strong> {p.ubicacion || "No especificada"}<br />
                  <strong>Categoría:</strong> {p.categoria || "Sin categoría"}
                </p>
                {token && (
                  <div className="d-flex gap-2 mt-auto">
                    <button className="btn btn-warning btn-sm" onClick={() => abrirEditar(p)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(p._id)}>Eliminar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!proyectos.length && <div className="text-center text-muted py-5">No hay proyectos registrados</div>}
    </div>
  );
}