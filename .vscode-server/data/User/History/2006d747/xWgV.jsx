import { useEffect, useState } from "react";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/proyectos")
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        // Limpiar espacios en URLs de imágenes
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

  if (loading) return <div style={{ padding: '150px', textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ padding: '150px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ 
      padding: '120px 20px 20px', 
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Our Projects</h1>
      <p style={{ color: '#666' }}>Total: {proyectos.length} proyectos</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {proyectos.map(p => (
          <div key={p._id} style={{ 
            background: 'white', 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* IMAGEN */}
            <div style={{ height: '200px', background: '#e0e0e0', overflow: 'hidden' }}>
              {p.imagenes.length > 0 ? (
                <img 
                  src={p.imagenes[0]} 
                  alt={p.titulo}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">🖼️ Image not found</div>';
                  }}
                />
              ) : (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '3rem'
                }}>
                  🏗️
                </div>
              )}
            </div>

            {/* CONTENIDO */}
            <div style={{ padding: '20px' }}>
              <span style={{ 
                display: 'inline-block',
                background: '#f6a623',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                {p.categoria || 'Project'}
              </span>
              
              <h3 style={{ margin: '0 0 10px', color: '#222', fontSize: '1.25rem' }}>
                {p.titulo}
              </h3>
              
              <p style={{ margin: '0 0 5px', color: '#666' }}>
                📍 {p.ubicacion || 'Location N/A'}
              </p>
              
              <p style={{ margin: '10px 0 0', color: '#888', fontSize: '14px', lineHeight: '1.5' }}>
                {p.descripcion || 'No description available'}
              </p>

              {/* CONTADOR DE IMÁGENES */}
              {p.imagenes.length > 1 && (
                <p style={{ margin: '10px 0 0', color: '#1a73e8', fontSize: '13px' }}>
                  +{p.imagenes.length - 1} more photos
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proyectos;