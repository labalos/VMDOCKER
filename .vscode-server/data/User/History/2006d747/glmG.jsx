import { useEffect, useState } from "react";
import styles from "./Proyectos.module.css";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState({
    open: false,
    project: null,
    index: 0,
  });

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

  const abrirLightbox = (project, idx) => {
    setLightbox({ open: true, project, index: idx });
  };

  const cerrarLightbox = () =>
    setLightbox({ open: false, project: null, index: 0 });

  const nextImage = () => {
    setLightbox((lb) => ({
      ...lb,
      index: (lb.index + 1) % lb.project.imagenes.length,
    }));
  };

  const prevImage = () => {
    setLightbox((lb) => ({
      ...lb,
      index:
        (lb.index - 1 + lb.project.imagenes.length) %
        lb.project.imagenes.length,
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Projects</h1>
      <p className={styles.subtitle}>Explore our recent construction work</p>

      <div className={styles.grid}>
        {proyectos.map((p) => (
          <div key={p._id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {p.imagenes && p.imagenes.length > 0 ? (
                <>
                  <img
                    src={p.imagenes[0]}
                    alt={p.titulo}
                    className={styles.mainImage}
                    onClick={() => abrirLightbox(p, 0)}
                  />
                  <div className={styles.thumbnailGrid}>
                    {p.imagenes.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${p.titulo} ${idx + 1}`}
                        className={styles.thumbnail}
                        onClick={() => abrirLightbox(p, idx)}
                      />
                    ))}
                  </div>
                </>
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

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div className={styles.lightboxOverlay} onClick={cerrarLightbox}>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.lightboxClose} onClick={cerrarLightbox}>
              ×
            </button>
            <button className={styles.lightboxPrev} onClick={prevImage}>
              ‹
            </button>
            <img
              src={lightbox.project.imagenes[lightbox.index]}
              alt={`${lightbox.project.titulo} ${lightbox.index + 1}`}
              className={styles.lightboxImage}
            />
            <button className={styles.lightboxNext} onClick={nextImage}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proyectos;
