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
      setMessage("Please complete all fields.");
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
        throw new Error(errorData.error || "Error sending the request");
      }

      // ÉXITO
      setMessage("Request sent successfully");
      setNombre("");
      setEmail("");
      setTelefono("");
      setServicio("");
      setMensaje("");

    } catch (error) {
      // ERROR
      setMessage(error.message || "There was an error submitting the request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
  
        <h2 className="text-center mb-2">Tell Us About Your Project</h2>
        <p className="text-center text-muted mb-4">We’ll get back to you shortly</p>
          <form onSubmit={handleSubmit}>
  
            {/* Mensaje arriba del formulario */}
            {message && (
              <p
                className={`${styles.alert} ${
                  message.includes("successfully")
                    ? styles.alertSuccess
                    : styles.alertDanger
                }`}
              >
                {message}
              </p>
            )}
  
            {/* NOMBRE */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Name"
                value={nombre}
                onChange={(e) => {
                  const value = e.target.value;
                  setNombre(value);
  
                  if (value.trim().length >= 3) {
                    setNombreValido(true);
                    setErrorNombre("");
                  } else {
                    setNombreValido(false);
                    setErrorNombre("The name must be at least 3 characters.");
                  }
                }}
                className={`form-control ${styles.input} ${
                  nombreValido === null
                    ? ""
                    : nombreValido
                    ? styles.inputSuccess
                    : styles.inputError
                }`}
              />
              {errorNombre && (
                <p className="text-danger">{errorNombre}</p>
              )}
            </div>
  
            {/* EMAIL */}
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
  
                  if (emailRegex.test(value)) {
                    setEmailValido(true);
                    setErrorEmail("");
                  } else {
                    setEmailValido(false);
                    setErrorEmail("Enter a valid email (e.g. user@mail.com).");
                  }
                }}
                className={`form-control ${styles.input} ${
                  emailValido === null
                    ? ""
                    : emailValido
                    ? styles.inputSuccess
                    : styles.inputError
                }`}
              />
              {errorEmail && (
                <p className="text-danger">{errorEmail}</p>
              )}
            </div>
  
            {/* TELÉFONO */}
            <div className="mb-3">
              <input
                type="tel"
                placeholder="Phone"
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  setTelefono(value);
  
                  if (telefonoRegex.test(value)) {
                    setTelefonoValido(true);
                    setErrorTelefono("");
                  } else {
                    setTelefonoValido(false);
                    setErrorTelefono("The phone must have between 7 and 15 numbers.");
                  }
                }}
                className={`form-control ${styles.input} ${
                  telefonoValido === null
                    ? ""
                    : telefonoValido
                    ? styles.inputSuccess
                    : styles.inputError
                }`}
              />
              {errorTelefono && (
                <p className="text-danger">{errorTelefono}</p>
              )}
            </div>
  
            {/* SERVICIO */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Service"
                value={servicio}
                onChange={(e) => {
                  const value = e.target.value;
                  setServicio(value);
  
                  if (value.trim().length >= 3) {
                    setServicioValido(true);
                    setErrorServicio("");
                  } else {
                    setServicioValido(false);
                    setErrorServicio("The service name must have at least 3 characters.");
                  }
                }}
                className={`form-control ${styles.input} ${
                  servicioValido === null
                    ? ""
                    : servicioValido
                    ? styles.inputSuccess
                    : styles.inputError
                }`}
              />
              {errorServicio && (
                <p className="text-danger">{errorServicio}</p>
              )}
            </div>
  
            {/* MENSAJE */}
            <div className="mb-3">
              <textarea
                placeholder="Message"
                value={mensaje}
                onChange={(e) => {
                  const value = e.target.value;
                  setMensaje(value);
  
                  if (value.trim().length >= 10) {
                    setMensajeValido(true);
                    setErrorMensaje("");
                  } else {
                    setMensajeValido(false);
                    setErrorMensaje("The message must be at least 10 characters long.");
                  }
                }}
                className={`form-control ${styles.input} ${
                  mensajeValido === null
                    ? ""
                    : mensajeValido
                    ? styles.inputSuccess
                    : styles.inputError
                }`}
                rows="4"
              />
              {errorMensaje && (
                <p className="text-danger">{errorMensaje}</p>
              )}
            </div>
  
             {/* BOTÓN */}
              <button
               type="submit"
               className={styles.btnMinimal}
               disabled={loading || !formularioValido}
              >
              {loading ? "Sending..." : "Send"}
              </button>
  
          </form>
  
        </div>
      </div>
    </div>
  );
}

export default Formulario;

