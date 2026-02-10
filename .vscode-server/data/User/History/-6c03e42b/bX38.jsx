import { useState, useEffect } from "react";
import styles from "./AdminSolicitudes.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [stats, setStats] = useState({ total: 0, byStatus: {} });

  // Filtros
  const [filters, setFilters] = useState({
    estado: "",
    service: "",
    fechaDesde: "",
    fechaHasta: ""
  });

  // Cargar solicitudes
  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Construir query string
      const params = new URLSearchParams();
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.service) params.append('service', filters.service);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      
      const response = await fetch(`${API_URL}/api/solicitudes${query}`, {
        headers: token ? { 'x-token': token } : {}
      });
      
      if (!response.ok) throw new Error('Error cargando solicitudes');
      
      const data = await response.json();
      setSolicitudes(data.solicitudes || []);
      
      // Calcular estadísticas
      calcularEstadisticas(data.solicitudes || []);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = (solicitudes) => {
    const byStatus = {};
    let total = 0;
    
    solicitudes.forEach(s => {
      byStatus[s.estado] = (byStatus[s.estado] || 0) + 1;
      total++;
    });
    
    setStats({ total, byStatus });
  };

  // Cambiar estado de una solicitud
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/solicitudes/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { 'x-token': token })
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      if (!response.ok) throw new Error('Error cambiando estado');
      
      // Recargar solicitudes
      await cargarSolicitudes();
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estados disponibles
  const estados = [
    { value: "nuevo", label: "🆕 Nuevo", color: "#3498db" },
    { value: "pendiente", label: "⏳ Pendiente", color: "#f39c12" },
    { value: "contactado", label: "📞 Contactado", color: "#9b59b6" },
    { value: "cotizado", label: "💰 Cotizado", color: "#1abc9c" },
    { value: "aprobado", label: "✅ Aprobado", color: "#2ecc71" },
    { value: "rechazado", label: "❌ Rechazado", color: "#e74c3c" },
    { value: "finalizado", label: "🏁 Finalizado", color: "#7f8c8d" }
  ];

  // Servicios disponibles
  const servicios = ["Construction", "Remodeling", "Painting", "Flooring", "Other"];

  useEffect(() => {
    cargarSolicitudes();
  }, [filters]);

  if (loading && solicitudes.length === 0) {
    return <div className={styles.loading}>Cargando solicitudes...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>📋 Panel de Solicitudes</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          {Object.entries(stats.byStatus).map(([estado, count]) => {
            const estadoInfo = estados.find(e => e.value === estado);
            return (
              <div key={estado} className={styles.statCard} style={{ borderLeftColor: estadoInfo?.color || '#ccc' }}>
                <span className={styles.statNumber}>{count}</span>
                <span className={styles.statLabel}>{estadoInfo?.label || estado}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Estado:</label>
          <select 
            value={filters.estado} 
            onChange={(e) => setFilters({...filters, estado: e.target.value})}
            className={styles.filterSelect}
          >
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Servicio:</label>
          <select 
            value={filters.service} 
            onChange={(e) => setFilters({...filters, service: e.target.value})}
            className={styles.filterSelect}
          >
            <option value="">Todos</option>
            {servicios.map(servicio => (
              <option key={servicio} value={servicio}>{servicio}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Desde:</label>
          <input 
            type="date" 
            value={filters.fechaDesde}
            onChange={(e) => setFilters({...filters, fechaDesde: e.target.value})}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Hasta:</label>
          <input 
            type="date" 
            value={filters.fechaHasta}
            onChange={(e) => setFilters({...filters, fechaHasta: e.target.value})}
            className={styles.filterInput}
          />
        </div>

        <button 
          onClick={() => setFilters({ estado: "", service: "", fechaDesde: "", fechaHasta: "" })}
          className={styles.clearButton}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          ❌ {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* Tabla de solicitudes */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Servicio</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.empty}>
                  No hay solicitudes {filters.estado ? `con estado "${filters.estado}"` : ""}
                </td>
              </tr>
            ) : (
              solicitudes.map((solicitud) => {
                const estadoInfo = estados.find(e => e.value === solicitud.estado);
                return (
                  <tr 
                    key={solicitud._id} 
                    className={styles.tableRow}
                    onClick={() => setSelectedSolicitud(solicitud)}
                  >
                    <td className={styles.idCell}>
                      #{solicitud._id?.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <strong>{solicitud.nombre}</strong>
                      {solicitud.email && <div className={styles.email}>{solicitud.email}</div>}
                    </td>
                    <td>{solicitud.service}</td>
                    <td>{solicitud.telefono}</td>
                    <td>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: estadoInfo?.color || '#ccc' }}
                      >
                        {estadoInfo?.label || solicitud.estado}
                      </span>
                    </td>
                    <td>{formatearFecha(solicitud.fecha)}</td>
                    <td>
                      <div className={styles.actions}>
                        <select 
                          value={solicitud.estado}
                          onChange={(e) => cambiarEstado(solicitud._id, e.target.value)}
                          className={styles.statusSelect}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {estados.map(estado => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                        <button 
                          className={styles.viewButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSolicitud(solicitud);
                          }}
                        >
                          👁️ Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle */}
      {selectedSolicitud && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSolicitud(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Solicitud #{selectedSolicitud._id?.slice(-6).toUpperCase()}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedSolicitud(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailGroup}>
                  <label>Nombre:</label>
                  <p>{selectedSolicitud.nombre}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Email:</label>
                  <p>
                    {selectedSolicitud.email ? (
                      <a href={`mailto:${selectedSolicitud.email}`}>
                        {selectedSolicitud.email}
                      </a>
                    ) : 'No proporcionado'}
                  </p>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Teléfono:</label>
                  <p>
                    <a href={`tel:${selectedSolicitud.telefono}`}>
                      {selectedSolicitud.telefono}
                    </a>
                  </p>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Servicio:</label>
                  <p>{selectedSolicitud.service}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Estado:</label>
                  <select 
                    value={selectedSolicitud.estado}
                    onChange={(e) => {
                      cambiarEstado(selectedSolicitud._id, e.target.value);
                      setSelectedSolicitud({
                        ...selectedSolicitud,
                        estado: e.target.value
                      });
                    }}
                    className={styles.modalStatusSelect}
                  >
                    {estados.map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Ubicación:</label>
                  <p>{selectedSolicitud.ubicacion || 'No especificada'}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Presupuesto:</label>
                  <p>{selectedSolicitud.presupuesto ? `$${selectedSolicitud.presupuesto}` : 'No especificado'}</p>
                </div>
                
                <div className={styles.detailGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Mensaje/Descripción:</label>
                  <div className={styles.messageBox}>
                    {selectedSolicitud.descripcion || 'Sin mensaje'}
                  </div>
                </div>
                
                <div className={styles.detailGroup}>
                  <label>Fecha de creación:</label>
                  <p>{formatearFecha(selectedSolicitud.fecha)}</p>
                </div>
                
                {selectedSolicitud.createdAt && (
                  <div className={styles.detailGroup}>
                    <label>Última actualización:</label>
                    <p>{formatearFecha(selectedSolicitud.updatedAt)}</p>
                  </div>
                )}
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.emailButton}
                  onClick={() => window.open(`mailto:${selectedSolicitud.email}`)}
                  disabled={!selectedSolicitud.email}
                >
                  📧 Enviar email
                </button>
                
                <button 
                  className={styles.whatsappButton}
                  onClick={() => window.open(`https://wa.me/${selectedSolicitud.telefono.replace(/\D/g, '')}`)}
                >
                  💬 WhatsApp
                </button>
                
                <button 
                  className={styles.closeModalButton}
                  onClick={() => setSelectedSolicitud(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}