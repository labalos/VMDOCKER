cat > src/components/AdminSolicitudes.jsx << 'EOF'
import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "./ui";
import styles from "./AdminSolicitudes.module.css";

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/solicitudes", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setSolicitudes(data.solicitudes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/solicitudes/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error("Failed to update");

      fetchSolicitudes();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "nuevo": return styles.badgeNuevo;
      case "contactado": return styles.badgeContactado;
      case "cerrado": return styles.badgeCerrado;
      default: return styles.badgeDefault;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quote Requests</h1>
        <p className={styles.subtitle}>Manage customer requests</p>
      </div>

      <div className={styles.grid}>
        {solicitudes.map((solicitud) => (
          <Card key={solicitud._id} className={styles.solicitudCard}>
            <CardBody>
              <div className={styles.cardHeader}>
                <h3 className={styles.clientName}>{solicitud.nombre}</h3>
                <span className={`${styles.badge} ${getEstadoBadgeClass(solicitud.estado)}`}>
                  {solicitud.estado}
                </span>
              </div>

              <div className={styles.details}>
                <p><strong>Service:</strong> {solicitud.service}</p>
                <p><strong>Phone:</strong> {solicitud.telefono}</p>
                {solicitud.email && <p><strong>Email:</strong> {solicitud.email}</p>}
                {solicitud.ubicacion && <p><strong>Location:</strong> {solicitud.ubicacion}</p>}
                {solicitud.presupuesto && <p><strong>Budget:</strong> ${solicitud.presupuesto}</p>}
                {solicitud.mensaje && (
                  <p className={styles.message}><strong>Message:</strong> {solicitud.mensaje}</p>
                )}
                <p className={styles.date}>
                  <strong>Date:</strong> {new Date(solicitud.fecha).toLocaleString()}
                </p>
              </div>

              <div className={styles.actions}>
                {solicitud.estado === "nuevo" && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => updateEstado(solicitud._id, "contactado")}
                  >
                    Mark Contacted
                  </Button>
                )}
                {solicitud.estado !== "cerrado" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateEstado(solicitud._id, "cerrado")}
                  >
                    Close
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF