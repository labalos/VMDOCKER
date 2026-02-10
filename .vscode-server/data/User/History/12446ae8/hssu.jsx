import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Home.module.css";
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const fetchWithAuth = async (endpoint, options = {}, token) => {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { "x-token": token }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).message || `Error ${res.status}`);
  return res.json();
};

const useForm = (initial) => {
  const [values, setValues] = useState(initial);
  const handleChange = useCallback((field) => (e) => setValues(p => ({ ...p, [field]: e.target.value })), []);
  const reset = useCallback(() => setValues(initial), [initial]);
  const setAll = useCallback(setValues, []);
  return { values, handleChange, reset, setAll };
};

const useImageList = (initial = []) => {
  const [images, setImages] = useState(initial);
  return {
    images, setImages,
    add: () => setImages(p => [...p, ""]),
    update: (i, v) => setImages(p => p.map((img, idx) => idx === i ? v : img)),
    remove: (i) => setImages(p => p.filter((_, idx) => idx !== i)),
    append: (url) => setImages(p => [...p, url]),
  };
};

export default function Home() {
  const token = localStorage.getItem("token");
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  const formCrear = useForm({ titulo: "", descripcion: "", categoria: "", ubicacion: "" });
  const formEditar = useForm({ titulo: "", descripcion: "", categoria: "", ubicacion: "" });
  const imagenes = useImageList();

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      const data = await fetchWithAuth("/proyectos", {}, token);
      setProyectos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
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
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    try {
      await fetchWithAuth(`/proyectos/${id}`, { method: "DELETE" }, token);
      setProyectos(p => p.filter(x => x._id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const abrirEditar = (p) => {
    setProyectoEditando(p);
    formEditar.setAll({
      titulo: p.titulo,
      descripcion: p.descripcion,
      categoria: p.categoria,
      ubicacion: p.ubicacion
    });
    imagenes.setImages(p.imagenes || []);
    setModalAbierto(true);
  };

  const handleEditar = async () => {
    try {
      const actualizado = await fetchWithAuth(
        `/proyectos/${proyectoEditando._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...formEditar.values,
            imagenes: imagenes.images.filter(x => x.trim())
          })
        },
        token
      );

      setProyectos(p =>
        p.map(x => x._id === proyectoEditando._id ? actualizado : x)
      );

      setModalAbierto(false);
    } catch (err) {
      alert("Error al editar: " + err.message);
    }
  };

  const handleSubirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const { url } = await fetchWithAuth("/upload", {
        method: "POST",
        body: formData
      }, token);

      imagenes.append(url);
    } catch (err) {
      alert("Error al subir: " + err.message);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div className={styles.loading}>Cargando proyectos...</div>;

  return (
    <div className={styles.container}>

      {/* NAV BUTTONS */}
      <div className={styles.navButtons}>
        <button className={styles.btnSecondary} onClick={() => window.location.href = "/admin"}>
          Dashboard
        </button>

        <Link to="/admin/solicitudes" className={styles.btnPrimary}>
          📋 Requests
        </Link>

        <button className={styles.btnLogout} onClick={cerrarSesion}>
          Logout
        </button>
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Projects Dashboard</h1>
        <p className={styles.subtitle}>Manage your construction projects</p>
      </div>

      {/* FORMULARIO CREAR */}
      {mostrarFormulario && (
        <div className={styles.formContainer}>
          <h2>Create New Project</h2>

          <form onSubmit={handleCrear}>
            <div className={styles.formField}>
              <input
                type="text"
                placeholder="Project Title"
                value={formCrear.values.titulo}
                onChange={formCrear.handleChange("titulo")}
                required
              />
            </div>

            <div className={styles.formField}>
              <textarea
                placeholder="Description"
                value={formCrear.values.descripcion}
                onChange={formCrear.handleChange("descripcion")}
                required
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                placeholder="Category"
                value={formCrear.values.categoria}
                onChange={formCrear.handleChange("categoria")}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                placeholder="Location"
                value={formCrear.values.ubicacion}
                onChange={formCrear.handleChange("ubicacion")}
              />
            </div>

            <button className={styles.btnSubmit}>Create Project</button>
          </form>
        </div>
      )}

      {/* GRID DE PROYECTOS */}
      <div className={styles.grid}>
        {proyectos.map((p) => (
          <div key={p._id} className={styles.card}>
            {p.imagenes?.[0] ? (
              <img src={p.imagenes[0]} className={styles.projectImage} />
            ) : (
              <div className={styles.projectImage}></div>
            )}

            <h3>{p.titulo}</h3>
            <p>{p.descripcion}</p>
            <p><strong>Category:</strong> {p.categoria}</p>
            <p><strong>Location:</strong> {p.ubicacion}</p>

            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => abrirEditar(p)}>
                Edit
              </button>

              <button className={styles.btnDelete} onClick={() => handleEliminar(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDITAR */}
      {modalAbierto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Project</h2>
              <button className={styles.modalClose} onClick={() => setModalAbierto(false)}>×</button>
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.values.titulo}
                onChange={formEditar.handleChange("titulo")}
              />
            </div>

            <div className={styles.formField}>
              <textarea
                value={formEditar.values.descripcion}
                onChange={formEditar.handleChange("descripcion")}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.values.categoria}
                onChange={formEditar.handleChange("categoria")}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.values.ubicacion}
                onChange={formEditar.handleChange("ubicacion")}
              />
            </div>

            <div>
              <h4>Images</h4>
              {imagenes.images.map((img, i) => (
                <div key={i} className={styles.formField}>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => imagenes.update(i, e.target.value)}
                  />
                  <button onClick={() => imagenes.remove(i)}>Remove</button>
                </div>
              ))}

              <input type="file" onChange={handleSubirImagen} />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setModalAbierto(false)}>
                Cancel
              </button>

              <button className={styles.btnPrimary} onClick={handleEditar}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}