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
  const formularioValido =
  nombreValido &&
  emailValido &&
  telefonoValido &&
  servicioValido &&
  mensajeValido;
  const [errorNombre, setErrorNombre] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [errorTelefono, setErrorTelefono] = useState("");
  const telefonoRegex = /^[0-9]{7,15}$/;
  const [errorServicio, setErrorServicio] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  
  console.log("API URL:", import.meta.env.VITE_API_URL);
  
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/solicitudes`, {
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
  
    if (value.trim().length >= 3) {
      setNombreValido(true);
      setErrorNombre(""); // sin error
    } else {
      setNombreValido(false);
      setErrorNombre("El nombre debe tener al menos 3 caracteres.");
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
{errorNombre && (
  <p className={styles.errorText}>{errorNombre}</p>
)}
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => {
    const value = e.target.value;
    setEmail(value);

    if (emailRegex.test(value)) {
      setEmailValido(true);
      setErrorEmail(""); // sin error
    } else {
      setEmailValido(false);
      setErrorEmail("Ingresa un email válido (ej: usuario@correo.com).");
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
{errorEmail && (
  <p className={styles.errorText}>{errorEmail}</p>
)}
<input
  type="tel"
  placeholder="Teléfono"
  value={telefono}
  onChange={(e) => {
    const value = e.target.value;
    setTelefono(value);

    if (telefonoRegex.test(value)) {
      setTelefonoValido(true);
      setErrorTelefono(""); // sin error
    } else {
      setTelefonoValido(false);
      setErrorTelefono("El teléfono debe tener entre 7 y 15 números.");
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
{errorTelefono && (
  <p className={styles.errorText}>{errorTelefono}</p>
)}
<input
  type="text"
  placeholder="Servicio"
  value={servicio}
  onChange={(e) => {
    const value = e.target.value;
    setServicio(value);

    if (value.trim().length >= 3) {
      setServicioValido(true);
      setErrorServicio(""); // sin error
    } else {
      setServicioValido(false);
      setErrorServicio("El servicio debe tener al menos 3 caracteres.");
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
{errorServicio && (
  <p className={styles.errorText}>{errorServicio}</p>
)}
<textarea
  placeholder="Mensaje"
  value={mensaje}
  onChange={(e) => {
    const value = e.target.value;
    setMensaje(value);

    if (value.trim().length >= 10) {
      setMensajeValido(true);
      setErrorMensaje(""); // sin error
    } else {
      setMensajeValido(false);
      setErrorMensaje("El mensaje debe tener al menos 10 caracteres.");
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
{errorMensaje && (
  <p className={styles.errorText}>{errorMensaje}</p>
)}
<button type="submit" disabled={loading || !formularioValido}>
  {loading ? "Enviando..." : "Enviar"}
</button>
    </form>
  );
}

export default Formulario;

