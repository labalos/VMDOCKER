import { useEffect, useState } from "react";
import styles from "./Proyectos.module.css";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0, title: "" });

  useEffect(() => {
    async function cargarProyectos() {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/proyectos`);
        if (!respuesta.ok) throw new Error("Error al cargar");
        const data = await respuesta.json();
        
        // Limpiar espacios en las URLs de imágenes
        const proyectosLimpios = data.map(p => ({
          ...p,
          imagenes: (p.imagenes || [])
            .map(img => img.trim())
            .filter(img => img.length > 0)
        }));
        
        setProyectos(proyectosLimpios);
      } catch (error) {
        setError(error.message);
        console.error("Error cargando proyectos:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarProyectos();
  }, []);

  const abrirLightbox = (images, index, title) => {
    setLightbox({ open: true, images, index, title });
  };

  const cerrarLightbox = () => {
    setLightbox({ open: false, images: [], index: 0, title: "" });
  };

  const nextImage = () => {
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % lb.images.length }));
  };

  const prevImage = () => {
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }));
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.open) return;
      if (e.key === "Escape") cerrarLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.open]);

  if (loading) return <div className={styles.loading}>Cargando proyectos...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Projects</h1>
          <p className={styles.subtitle}>Explore our recent construction work</p>
        </div>

        {proyectos.length === 0 ? (
          <div className={styles.empty}>No projects found</div>
        ) : (
          <div className={styles.grid}>
            {proyectos.map((p) => (
              <div key={p._id} className={styles.card}>
                {/* Imagen principal o placeholder */}
                <div className={styles.imageWrapper}>
                  {p.imagenes.length > 0 ? (
                    <img
                      src={p.imagenes[0]}
                      alt={p.titulo}
                      className={styles.mainImage}
                      onClick={() => abrirLightbox(p.imagenes, 0, p.titulo)}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='16'%3EImage not available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <span>🏗️</span>
                      <p>No images</p>
                    </div>
                  )}
                  
                  {/* Badge de categoría */}
                  <span className={styles.category}>{p.categoria || "Project"}</span>
                  
                  {/* Contador de imágenes */}
                  {p.imagenes.length > 1 && (
                    <span className={styles.imageCount}>+{p.imagenes.length - 1}</span>
                  )}
                </div>

                {/* Miniaturas (máximo 3) */}
                {p.imagenes.length > 1 && (
                  <div className={styles.thumbnails}>
                    {p.imagenes.slice(1, 4).map((img, idx) => (
                      <div key={idx} className={styles.thumbWrapper}>
                        <img
                          src={img}
                          alt={`${p.titulo} ${idx + 2}`}
                          className={styles.thumb}
                          onClick={() => abrirLightbox(p.imagenes, idx + 1, p.titulo)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {idx === 2 && p.imagenes.length > 4 && (
                          <div className={styles.moreOverlay}>+{p.imagenes.length - 4}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Contenido */}
                <div className={styles.content}>
                  <h2 className={styles.cardTitle}>{p.titulo}</h2>
                  <p className={styles.location}>📍 {p.ubicacion || "Location N/A"}</p>
                  <p className={styles.description}>
                    {p.descripcion || "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox.open && (
          <div className={styles.lightboxOverlay} onClick={cerrarLightbox}>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.lightboxClose} onClick={cerrarLightbox}>×</button>
              
              {lightbox.images.length > 1 && (
                <>
                  <button className={styles.lightboxPrev} onClick={prevImage}>‹</button>
                  <button className={styles.lightboxNext} onClick={nextImage}>›</button>
                </>
              )}
              
              <img
                src={lightbox.images[lightbox.index]}
                alt={`${lightbox.title} ${lightbox.index + 1}`}
                className={styles.lightboxImage}
              />
              
              <div className={styles.lightboxInfo}>
                {lightbox.title} — {lightbox.index + 1} / {lightbox.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Proyectos;