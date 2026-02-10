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
  const [nombreValido, setNombreValido] = useState(null);
  const [emailValido, setEmailValido] = useState(null);
  const [telefonoValido, setTelefonoValido] = useState(null);
  const [servicioValido, setServicioValido] = useState(null);
  const [mensajeValido, setMensajeValido] = useState(null);
  
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
  onChange={(e) => {
    const value = e.target.value;
    setEmail(value);

    // Validación en tiempo real
    if (emailRegex.test(value)) {
      setEmailValido(true);
    } else {
      setEmailValido(false);
    }
  }}
  className={`${styles.input} ${
    emailValido === null
      ? ""
      : emailValido
      ? styles.inputSuccess
      : styles.inputError
  }`}
/>
<input
  type="tel"
  placeholder="Teléfono"
  value={telefono}
  onChange={(e) => {
    const value = e.target.value;
    setTelefono(value);

    // Validación en tiempo real
    if (telefonoRegex.test(value)) {
      setTelefonoValido(true);
    } else {
      setTelefonoValido(false);
    }
  }}
  className={`${styles.input} ${
    telefonoValido === null
      ? ""
      : telefonoValido
      ? styles.inputSuccess
      : styles.inputError
  }`}
/>
<input
  type="text"
  placeholder="Servicio"
  value={servicio}
  onChange={(e) => {
    const value = e.target.value;
    setServicio(value);

    // Validación en tiempo real
    if (value.trim().length >= 3) {
      setServicioValido(true);
    } else {
      setServicioValido(false);
    }
  }}
  className={`${styles.input} ${
    servicioValido === null
      ? ""
      : servicioValido
      ? styles.inputSuccess
      : styles.inputError
  }`}
/>
<textarea
  placeholder="Mensaje"
  value={mensaje}
  onChange={(e) => {
    const value = e.target.value;
    setMensaje(value);

    // Validación en tiempo real
    if (value.trim().length >= 10) {
      setMensajeValido(true);
    } else {
      setMensajeValido(false);
    }
  }}
  className={`${styles.input} ${
    mensajeValido === null
      ? ""
      : mensajeValido
      ? styles.inputSuccess
      : styles.inputError
  }`}
/>

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}

export default Formulario;

