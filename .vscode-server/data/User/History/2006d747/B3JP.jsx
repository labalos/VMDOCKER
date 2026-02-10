import { useEffect, useState } from "react";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox state
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    currentIndex: 0,
    title: ''
  });

  useEffect(() => {
    fetch("/api/proyectos") // <-- Asegúrate de usar /api/proyectos
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        // Si tu backend devuelve un array directamente
        const limpios = data.map(p => ({
          ...p,
          imagenes: (p.imagenes || [])
            .map(img => img.trim())
            .filter(img => img.length > 0)
        }));
        setProyectos(limpios);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openLightbox = (images, index, title) => {
    setLightbox({ open: true, images, currentIndex: index, title });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox({ open: false, images: [], currentIndex: 0, title: '' });
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setLightbox(lb => ({
      ...lb,
      currentIndex: (lb.currentIndex + 1) % lb.images.length
    }));
  };

  const prevImage = () => {
    setLightbox(lb => ({
      ...lb,
      currentIndex: (lb.currentIndex - 1 + lb.images.length) % lb.images.length
    }));
  };

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.open]);

  if (loading) return <div style={{ padding: '150px', textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ padding: '150px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div style={{ padding: '120px 20px 40px', background: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '2.5rem' }}>Our Projects</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>{proyectos.length} projects completed</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {proyectos.map(p => (
              <div key={p._id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ height: '220px', background: '#e8e8e8', position: 'relative' }}>
                  {p.imagenes.length > 0 ? (
                    <>
                      <img
                        src={p.imagenes[0]}
                        alt={p.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onClick={() => openLightbox(p.imagenes, 0, p.titulo)}
                      />
                      {p.imagenes.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          +{p.imagenes.length - 1}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#bbb',
                      fontSize: '4rem'
                    }}>🏗️</div>
                  )}
                </div>

                <div style={{ padding: '20px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#1a73e8',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}>
                    {p.categoria || 'Construction'}
                  </span>

                  <h3 style={{ margin: '0 0 8px', color: '#222', fontSize: '1.3rem', fontWeight: '700' }}>
                    {p.titulo}
                  </h3>

                  <p style={{ margin: '0 0 12px', color: '#666', fontSize: '14px' }}>
                    📍 {p.ubicacion || 'Location not specified'}
                  </p>

                  <p style={{
                    margin: 0,
                    color: '#888',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {p.descripcion || 'No description available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={closeLightbox}>
          <button onClick={closeLightbox} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '40px',
            cursor: 'pointer',
            zIndex: 10
          }}>×</button>

          {lightbox.images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{
              position: 'absolute',
              left: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              fontSize: '50px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>‹</button>
          )}

          <img
            src={lightbox.images[lightbox.currentIndex]}
            alt={lightbox.title}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain'
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{
              position: 'absolute',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              fontSize: '50px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>›</button>
          )}

          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 20px',
            borderRadius: '20px'
          }}>
            {lightbox.title} — {lightbox.currentIndex + 1} / {lightbox.images.length}
          </div>
        </div>
      )}
    </>
  );
}

export default Proyectos;
