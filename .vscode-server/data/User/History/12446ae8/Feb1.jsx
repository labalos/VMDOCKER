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



<Link to="/admin/solicitudes" className={styles.btnPrimary}>
  📋 Ver Solicitudes
</Link>



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
    add: useCallback(() => setImages(p => [...p, ""]), []),
    update: useCallback((i, v) => setImages(p => p.map((img, idx) => idx === i ? v : img)), []),
    remove: useCallback((i) => setImages(p => p.filter((_, idx) => idx !== i)), []),
    append: useCallback((url) => setImages(p => [...p, url]), []),
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
    formEditar.setAll({ titulo: p.titulo, descripcion: p.descripcion, categoria: p.categoria, ubicacion: p.ubicacion });
    imagenes.setImages(p.imagenes || []);
    setModalAbierto(true);
  };

  const handleEditar = async () => {
    try {
      const actualizado = await fetchWithAuth(
        `/proyectos/${proyectoEditando._id}`,
        { method: "PUT", body: JSON.stringify({ ...formEditar.values, imagenes: imagenes.images.filter(x => x.trim()) }) },
        token
      );
      setProyectos(p => p.map(x => x._id === proyectoEditando._id ? actualizado : x));
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
      const { url } = await fetchWithAuth("/upload", { method: "POST", body: formData }, token);
      imagenes.append(url);
    } catch (err) {
      alert("Error al subir: " + err.message);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const campos = useMemo(() => [
    { name: "titulo", placeholder: "Project Title", required: true },
    { name: "descripcion", placeholder: "Description", required: true },
    { name: "categoria", placeholder: "Category", required: false },
    { name: "ubicacion", placeholder: "Location", required: false },
  ], []);

  if (loading) return <div className={styles.loading}>Cargando proyectos...</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => setMostrarFormulario(v => !v)}>
            {mostrarFormulario ? "✕ Cancel" : "+ New Project"}
          </button>
          <button className={styles.btnSecondary} onClick={cerrarSesion}>
            Logout
          </button>
        </div>
      </div>

      {/* FORMULARIO CREAR */}
      {mostrarFormulario && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Create New Project</h3>
          <form onSubmit={handleCrear}>
            <div className={styles.formGrid}>
              {campos.map(({ name, placeholder, required }) => (
                <input
                  key={name}
                  type="text"
                  placeholder={placeholder}
                  value={formCrear.values[name]}
                  onChange={formCrear.handleChange(name)}
                  required={required}
                  className={styles.input}
                />
              ))}
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>Save Project</button>
              <button type="button" className={styles.btnSecondary} onClick={() => setMostrarFormulario(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* GRID PROYECTOS */}
      {proyectos.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📁</div>
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className={styles.projectsGrid}>
          {proyectos.map(p => (
            <div key={p._id} className={styles.projectCard}>
              <div className={styles.imageWrapper}>
                {p.imagenes?.[0] ? (
                  <img src={p.imagenes[0]} alt={p.titulo} className={styles.image} />
                ) : (
                  <div className={styles.noImage}>🏗️</div>
                )}
                <span className={styles.categoryBadge}>{p.categoria || "Project"}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{p.titulo}</h3>
                <p className={styles.cardMeta}>📍 {p.ubicacion || "No location"}</p>
                <p className={styles.cardDescription}>{p.descripcion}</p>
                <div className={styles.cardActions}>
                  <button className={styles.btnEdit} onClick={() => abrirEditar(p)}>✏️ Edit</button>
                  <button className={styles.btnDelete} onClick={() => handleEliminar(p._id)}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalAbierto && (
        <div className={styles.modalOverlay} onClick={() => setModalAbierto(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Project</h3>
              <button className={styles.btnClose} onClick={() => setModalAbierto(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className="mb-3">
                <label className="form-label fw-bold">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleSubirImagen} />
              </div>

              {campos.map(({ name, placeholder, required }) => (
                <div key={name} className="mb-3">
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={formEditar.values[name]}
                    onChange={formEditar.handleChange(name)}
                    required={required}
                    className="form-control"
                  />
                </div>
              ))}

              <div className={styles.imageSection}>
                <label className={styles.imageSectionTitle}>Project Images</label>
                {imagenes.images.map((img, i) => (
                  <div key={i} className={styles.imageInputGroup}>
                    <input type="text" className="form-control" value={img} onChange={(e) => imagenes.update(i, e.target.value)} placeholder="https://..." />
                    <button type="button" className={styles.btnRemove} onClick={() => imagenes.remove(i)}>×</button>
                  </div>
                ))}
                <button type="button" className={styles.btnAdd} onClick={imagenes.add}>+ Add Image URL</button>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setModalAbierto(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleEditar}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}