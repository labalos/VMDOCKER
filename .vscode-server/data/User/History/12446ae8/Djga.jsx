import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";

const API_URL = '/api/admin'; // usar proxy de Vite (target: backend:3001)

export default function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchWithAuth = async (endpoint, options = {}, tkn = token) => {
    const headers = {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(tkn && { "x-token": tkn }),
      ...options.headers,
    };
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error((await res.json()).message || `Error ${res.status}`);
    return res.json();
  };

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  const [formCrear, setFormCrear] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    ubicacion: "",
  });

  const [formEditar, setFormEditar] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    ubicacion: "",
  });

  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    cargarProyectos();
  }, [token]);

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
      const nuevo = await fetchWithAuth(
        "/proyectos",
        {
          method: "POST",
          body: JSON.stringify(formCrear),
        },
        token
      );

      setProyectos((p) => [...p, nuevo]);
      setFormCrear({ titulo: "", descripcion: "", categoria: "", ubicacion: "" });
      setMostrarFormulario(false);
    } catch (err) {
      alert("Error al crear: " + err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    try {
      await fetchWithAuth(`/proyectos/${id}`, { method: "DELETE" }, token);
      setProyectos((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const abrirEditar = (p) => {
    setProyectoEditando(p);
    setFormEditar({
      titulo: p.titulo,
      descripcion: p.descripcion,
      categoria: p.categoria,
      ubicacion: p.ubicacion,
    });
    setImagenes(p.imagenes || []);
    setModalAbierto(true);
  };

  const handleEditar = async () => {
    try {
      const actualizado = await fetchWithAuth(
        `/proyectos/${proyectoEditando._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...formEditar,
            imagenes: imagenes.filter((x) => x.trim()),
          }),
        },
        token
      );

      setProyectos((p) =>
        p.map((x) => (x._id === proyectoEditando._id ? actualizado : x))
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
      const { url } = await fetchWithAuth(
        "/upload",
        { method: "POST", body: formData },
        token
      );

      setImagenes((prev) => [...prev, url]);
    } catch (err) {
      alert("Error al subir: " + err.message);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>

      {/* NAV BUTTONS (igual que en Solicitudes) */}
      <div className={styles.navButtons}>
        <button
          className={styles.btnSecondary}
          onClick={() => (window.location.href = "/admin")}
        >
          Dashboard
        </button>

        <Link to="/admin/solicitudes" className={styles.btnPrimary}>
          Requests
        </Link>

        <button className={styles.btnLogout} onClick={cerrarSesion}>
          Logout
        </button>
      </div>

      {/* HEADER (alineado como Solicitudes) */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Manage your construction projects</p>
        </div>

        <button
          className={styles.btnPrimary}
          onClick={() => setMostrarFormulario((v) => !v)}
        >
          {mostrarFormulario ? "Cancel" : "New Project"}
        </button>
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
                value={formCrear.titulo}
                onChange={(e) =>
                  setFormCrear({ ...formCrear, titulo: e.target.value })
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formField}>
              <textarea
                placeholder="Description"
                value={formCrear.descripcion}
                onChange={(e) =>
                  setFormCrear({ ...formCrear, descripcion: e.target.value })
                }
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                placeholder="Category"
                value={formCrear.categoria}
                onChange={(e) =>
                  setFormCrear({ ...formCrear, categoria: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                placeholder="Location"
                value={formCrear.ubicacion}
                onChange={(e) =>
                  setFormCrear({ ...formCrear, ubicacion: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <button className={styles.btnPrimary}>Create Project</button>
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

            <div className={styles.cardActions}>
              <button className={styles.btnEdit} onClick={() => abrirEditar(p)}>
                Edit
              </button>

              <button
                className={styles.btnDelete}
                onClick={() => handleEliminar(p._id)}
              >
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
              <h2>Edit Project</h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalAbierto(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.titulo}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, titulo: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <textarea
                value={formEditar.descripcion}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, descripcion: e.target.value })
                }
                className={styles.textarea}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.categoria}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, categoria: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <div className={styles.formField}>
              <input
                type="text"
                value={formEditar.ubicacion}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, ubicacion: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setModalAbierto(false)}
              >
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