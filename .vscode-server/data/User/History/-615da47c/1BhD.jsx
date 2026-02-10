import { useState } from "react";
import styles from "./Formulario.module.css";

function Formulario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicio, setServicio] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!nombre || !email || !telefono || !servicio || !mensaje) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          servicio,
          mensaje
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la solicitud");
      }

      // ÉXITO
      setMessage("Solicitud enviada correctamente");
      setNombre("");
      setEmail("");
      setTelefono("");
      setServicio("");
      setMensaje("");

    } catch (error) {
      // ERROR
      setMessage(error.message || "Hubo un error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* mensaje arriba del formulario */}
      {message && (
  <p
    className={`${styles.alert} ${
      message.includes("correctamente")
        ? styles.alertSuccess
        : styles.alertDanger
    }`}
  >
    {message}
  </p>
)}

<input
  type="text"
  placeholder="Nombre"
  value={nombre}
  onChange={(e) => {
    const value = e.target.value;
    setNombre(value);

    // Validación en tiempo real
    if (value.trim().length >= 3) {
      setNombreValido(true);
    } else {
      setNombreValido(false);
    }
  }}
  className={`${styles.input} ${
    nombreValido === null
      ? ""
      : nombreValido
      ? styles.inputSuccess
      : styles.inputError
  }`}
/>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <input
        type="text"
        placeholder="Servicio"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
      />
      <textarea
        placeholder="Mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      ></textarea>

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}

export default Formulario;

