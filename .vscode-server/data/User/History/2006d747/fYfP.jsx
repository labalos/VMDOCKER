import { useEffect, useState } from "react";
import styles from "./Proyectos.module.css";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PRUEBA SIMPLE CON FETCH
    fetch("/api/proyectos")
      .then(r => {
        console.log("Status:", r.status);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        console.log("Proyectos recibidos:", data.length);
        // Limpiar espacios en URLs
        const limpios = data.map(p => ({
          ...p,
          imagenes: (p.imagenes || []).map(img => img.trim()).filter(Boolean)
        }));
        setProyectos(limpios);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error completo:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Projects</h1>
        <p className={styles.subtitle}>Total: {proyectos.length} proyectos</p>

        <div className={styles.grid}>
          {proyectos.map(p => (
            <div key={p._id} className={styles.card}>
              <h3>{p.titulo}</h3>
              <p>{p.ubicacion}</p>
              <p>Imágenes: {p.imagenes.length}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Proyectos;