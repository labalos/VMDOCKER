import { useEffect, useState } from "react";
import styles from "./Proyectos.module.css";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarProyectos() {
      try {
        const respuesta = await fetch("http://192.168.1.28:3000/proyectos");
        if (!respuesta.ok) throw new Error("Error al cargar");
        const data = await respuesta.json();
        setProyectos(data);
      } catch (error) {
        setError(error.message);
        console.error("Error cargando proyectos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarProyectos();
  }, []);

  if (loading)
    return <div className={styles.loading}>Cargando proyectos...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Projects</h1>
      <p className={styles.subtitle}>Explore our recent construction work</p>

      <div className={styles.grid}>
        {proyectos.map((p) => (
          <div key={p._id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {p.imagenes && p.imagenes.length > 0 ? (
                <div className={styles.imageGrid}>
                  {p.imagenes.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${p.titulo} ${idx + 1}`}
                      className={styles.image}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
              <span className={styles.category}>
                {p.categoria || "Project"}
              </span>
            </div>

            <div className={styles.content}>
              <h2 className={styles.cardTitle}>{p.titulo}</h2>
              <p className={styles.location}>
                📍 {p.ubicacion || "Location N/A"}
              </p>
              <p className={styles.description}>
                {p.descripcion || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proyectos;
