import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "./ui";
import styles from "./AdminSolicitudes.module.css";

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // evita llamada sin token
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchWithAuth('http://localhost:3001/api/admin/solicitudes', {
        method: 'GET',
      }, token);
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
      await fetchWithAuth(`http://localhost:3001/api/admin/solicitudes/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      }, token);
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

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>

      {/* NAV BUTTONS */}
      <div className={styles.navButtons}>
        <button
          className={styles.btnSecondary}
          onClick={() => window.location.href = "/admin"}
        >
          ← Back to Dashboard
        </button>

        <button
          className={styles.btnLogout}
          onClick={cerrarSesion}
        >
          Logout
        </button>
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quote Requests</h1>
        <p className={styles.subtitle}>Manage customer requests</p>
      </div>

      {/* GRID */}
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