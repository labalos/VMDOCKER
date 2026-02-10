import { useState } from "react";
import styles from "./Formulario.module.css";

function Formulario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [service, setService] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);

  const [nombreValido, setNombreValido] = useState(null);
  const [emailValido, setEmailValido] = useState(null);
  const [telefonoValido, setTelefonoValido] = useState(null);
  const [mensajeValido, setMensajeValido] = useState(null);
  const [serviceValido, setServiceValido] = useState(null);

  const [errorNombre, setErrorNombre] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [errorService, setErrorService] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[0-9]{7,15}$/;

  const formularioValido =
    nombreValido &&
    emailValido &&
    telefonoValido &&
    mensajeValido &&
    serviceValido;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service) {
      setErrorService("Please select a service.");
      setServiceValido(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/solicitudes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            email,
            telefono,
            mensaje,
            service,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error sending the request");
      }

      setMessage("Thank you for your message. We will contact you shortly.");
      setMessageType("success");

      setNombre("");
      setEmail("");
      setTelefono("");
      setMensaje("");
      setService("");

      setNombreValido(null);
      setEmailValido(null);
      setTelefonoValido(null);
      setMensajeValido(null);
      setServiceValido(null);

    } catch (error) {
      setMessage(error.message || "There was an error submitting the request");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-2">Tell Us About Your Project</h2>
          <p className="text-center text-muted mb-4">
            We’ll get back to you shortly
          </p>

          <form onSubmit={handleSubmit}>
            {message && (
              <p
                className={`${styles.alert} ${
                  messageType === "success"
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
              {errorNombre && <p className="text-danger">{errorNombre}</p>}
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
              {errorEmail && <p className="text-danger">{errorEmail}</p>}
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
                    setErrorTelefono(
                      "The phone must have between 7 and 15 numbers."
                    );
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
              {errorTelefono && <p className="text-danger">{errorTelefono}</p>}
            </div>

            {/* TYPE OF SERVICE — BOTONES PILL */}
            <div className="mb-3">
              <label className="form-label">Type of Service</label>
              <div className={styles.pillGroup}>
                {[
                  "Remodeling",
                  "Construction",
                  "Painting",
                  "Flooring",
                  "Other",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.pillButton} ${
                      service === option ? styles.pillSelected : ""
                    }`}
                    onClick={() => {
                      setService(option);
                      setServiceValido(true);
                      setErrorService("");
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errorService && <p className="text-danger">{errorService}</p>}
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
                    setErrorMensaje(
                      "The message must be at least 10 characters long."
                    );
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
              {errorMensaje && <p className="text-danger">{errorMensaje}</p>}
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