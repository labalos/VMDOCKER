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
        return value.trim().length >= 3 ? "" : "Name must be at least 3 characters";
      case "email":
        return emailRegex.test(value) ? "" : "Enter a valid email";
      case "telefono":
        return telefonoRegex.test(value) ? "" : "Phone must have 7-15 digits";
      case "mensaje":
        return value.trim().length >= 10 ? "" : "Message must be at least 10 characters";
      case "service":
        return value ? "" : "Please select a service";
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
    
    // Validar todo
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

      if (!response.ok) throw new Error("Error sending request");

      setMessage("Thank you! We'll contact you shortly.");
      setMessageType("success");
      
      // Reset form
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "", service: "" });
      setTouched({});
      setErrors({});
    } catch (error) {
      setMessage("There was an error. Please try again.");
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
          <h1 className={styles.title}>Tell Us About Your Project</h1>
          <p className={styles.subtitle}>We'll get back to you within 24 hours</p>
        </div>

        <div className={styles.formCard}>
          {message && (
            <div className={`${styles.alert} ${messageType === "success" ? styles.alertSuccess : styles.alertError}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <label className={styles.label}>Email Address</label>
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
              <label className={styles.label}>Phone Number</label>
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
              <label className={styles.label}>Type of Service</label>
              <div className={styles.pillGroup}>
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    className={`${styles.pillButton} ${formData.service === service ? styles.pillSelected : ""}`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    {service}
                  </button>
                ))}
              </div>
              {errors.service && <p className={styles.errorText}>{errors.service}</p>}
            </div>

            {/* Mensaje */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Project Details</label>
              <textarea
                name="mensaje"
                placeholder="Tell us about your project..."
                rows="4"
                value={formData.mensaje}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("mensaje")}
              />
              {errors.mensaje && <p className={styles.errorText}>{errors.mensaje}</p>}
            </div>

            {/* Submit */}
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