import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./Home.module.css";
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const fetchWithAuth = async (endpoint, options = {}, token) => {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { "Authorization": `Bearer ${token}` }),
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

      {/* NAV BUTTONS */}
      <div className={styles.navButtons}>
        <button
          className={styles.btnSecondary}
          onClick={() => window.location.href = "/admin"}
        >
          Dashboard
        </button>

        <Link to="/admin/solicitudes" className={styles.btnPrimary}>
          📋 Requests
        </Link>

        <button
          className={styles.btnLogout}
          onClick={cerrarSesion}
        >
          Logout
        </button>
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Projects Dashboard</h1>
        <p className={styles.subtitle}>Manage your construction projects</p>
      </div>

      {/* TODO: Aquí sigue tu contenido original (grid, modales, formularios, etc.) */}
      {/* No lo borro porque tu lógica ya funciona */}
    </div>
  );
}