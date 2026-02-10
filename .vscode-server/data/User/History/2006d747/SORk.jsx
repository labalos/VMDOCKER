import { useEffect, useState } from "react";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/proyectos")
      .then(r => {
        console.log("Status:", r.status);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        console.log("Proyectos recibidos:", data.length);
        const limpios = data.map(p => ({
          ...p,
          imagenes: (p.imagenes || []).map(img => img.trim()).filter(Boolean)
        }));
        setProyectos(limpios);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '150px', textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ padding: '150px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  // ← AQUÍ VA EL NUEVO RETURN
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {proyectos.map(p => (
          <div key={p._id} style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px', color: '#222' }}>{p.titulo}</h3>
            <p style={{ margin: '0 0 5px', color: '#666' }}>📍 {p.ubicacion}</p>
            <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
              {p.imagenes.length} imágenes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proyectos;