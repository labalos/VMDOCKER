import { useState } from "react";
import styles from "./Formulario.module.css";

function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    service: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[0-9]{7,15}$/;

  const services = ["Remodeling", "Construction", "Painting", "Flooring", "Other"];

  const validate = (name, value) => {
    switch (name) {
      case "nombre":
        return value.trim().length >= 3 ? "" : "Min 3 characters";
      case "email":
        return emailRegex.test(value) ? "" : "Invalid email";
      case "telefono":
        return telefonoRegex.test(value) ? "" : "7-15 digits";
      case "mensaje":
        return value.trim().length >= 10 ? "" : "Min 10 characters";
      case "service":
        return value ? "" : "Select service";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service }));
    setErrors(prev => ({ ...prev, service: "" }));
    setTouched(prev => ({ ...prev, service: true }));
  };

  const isValid = () => {
    return (
      formData.nombre.trim().length >= 3 &&
      emailRegex.test(formData.email) &&
      telefonoRegex.test(formData.telefono) &&
      formData.mensaje.trim().length >= 10 &&
      formData.service
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validate(key, formData[key]);
    });
    setErrors(newErrors);
    setTouched({ nombre: true, email: true, telefono: true, mensaje: true, service: true });

    if (Object.values(newErrors).some(e => e)) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/solicitudes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Error");

      setMessage("Thank you! We'll contact you shortly.");
      setMessageType("success");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "", service: "" });
      setTouched({});
      setErrors({});
    } catch (error) {
      setMessage("Error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (name) => {
    if (!touched[name]) return styles.input;
    return `${styles.input} ${errors[name] ? styles.inputError : styles.inputSuccess}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Get Your Free Quote</h1>
          <p className={styles.subtitle}>Tell us about your project</p>
        </div>

        <div className={styles.formCard}>
          {message && (
            <div className={`${styles.alert} ${messageType === "success" ? styles.alertSuccess : styles.alertError}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Nombre */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="John Smith"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("nombre")}
                />
                {errors.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("email")}
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>

              {/* Teléfono */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="1234567890"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("telefono")}
                />
                {errors.telefono && <p className={styles.errorText}>{errors.telefono}</p>}
              </div>

              {/* Servicio */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Service</label>
                <div className={styles.pillGroup}>
                  {services.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.pillButton} ${formData.service === s ? styles.pillSelected : ""}`}
                      onClick={() => handleServiceSelect(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className={styles.pillGroup} style={{marginTop: '0.5rem'}}>
                  {services.slice(3).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.pillButton} ${formData.service === s ? styles.pillSelected : ""}`}
                      onClick={() => handleServiceSelect(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.service && <p className={styles.errorText}>{errors.service}</p>}
              </div>

              {/* Mensaje - ancho completo */}
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Project Details</label>
                <textarea
                  name="mensaje"
                  placeholder="Describe your project..."
                  rows="3"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${getInputClass("mensaje")} ${styles.textarea}`}
                />
                {errors.mensaje && <p className={styles.errorText}>{errors.mensaje}</p>}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !isValid()}
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Formulario;