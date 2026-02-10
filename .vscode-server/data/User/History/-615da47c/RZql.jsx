import { useState } from "react";
import styles from "./Formulario.module.css";

// Servicios disponibles (pueden venir de una API en el futuro)
const servicios = [
  "Construction",
  "Remodeling", 
  "Painting",
  "Flooring",
  "Other"
];

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    service: "",
    mensaje: "",
    ubicacion: "",      // 🆕 Nuevo campo opcional
    presupuesto: ""     // 🆕 Nuevo campo opcional
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) setError("");
  };

  // Validación del formulario
  const validateForm = () => {
    if (!formData.nombre.trim()) {
      return "Name is required";
    }
    
    if (!formData.telefono.trim()) {
      return "Phone number is required";
    }
    
    // Validar teléfono básico
    const phoneRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      return "Please enter a valid phone number (8-20 digits)";
    }
    
    if (!formData.service) {
      return "Please select a service";
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // 🎯 Envía EXACTAMENTE los mismos campos que antes + los nuevos opcionales
      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          telefono: formData.telefono.trim(),
          service: formData.service,
          mensaje: formData.mensaje.trim(),
          ubicacion: formData.ubicacion.trim(),    // 🆕 Nuevo campo
          presupuesto: formData.presupuesto.trim() // 🆕 Nuevo campo
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error sending request");
      }
      
      // Éxito
      setSuccess(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        service: "",
        mensaje: "",
        ubicacion: "",
        presupuesto: ""
      });
      
      // Resetear éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Request a Quote</h2>
        <p className={styles.subtitle}>
          Fill out the form and we'll contact you within 24 hours
        </p>
      </div>

      {success && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✓</span>
          <div>
            <strong>Thank you, {formData.nombre}!</strong>
            <p>We've received your request for {formData.service}. We'll contact you soon.</p>
            <small>You should receive a confirmation email shortly.</small>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campos principales (igual que antes) */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.input}
              placeholder="John Smith"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="telefono" className={styles.label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={styles.input}
              placeholder="+1 (123) 456-7890"
              required
            />
            <small className={styles.helperText}>
              Include country code if international
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service" className={styles.label}>
              Service Required *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select a service</option>
              {servicios.map((servicio) => (
                <option key={servicio} value={servicio}>
                  {servicio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🆕 Nuevos campos opcionales */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="ubicacion" className={styles.label}>
              Project Location (Optional)
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className={styles.input}
              placeholder="City, State or Address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="presupuesto" className={styles.label}>
              Estimated Budget (Optional)
            </label>
            <div className={styles.inputGroup}>
              <span className={styles.currency}>$</span>
              <input
                type="text"
                id="presupuesto"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                className={`${styles.input} ${styles.budgetInput}`}
                placeholder="5000"
              />
            </div>
            <small className={styles.helperText}>
              Approximate amount in USD
            </small>
          </div>
        </div>

        {/* Campo mensaje (igual que antes) */}
        <div className={styles.formGroup}>
          <label htmlFor="mensaje" className={styles.label}>
            Project Details
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Tell us about your project, timeline, specific requirements..."
            rows="4"
          />
          <small className={styles.helperText}>
            The more details you provide, the better we can help you
          </small>
        </div>

        {/* Botón de envío */}
        <div className={styles.submitContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
          <p className={styles.disclaimer}>
            * Required fields. By submitting, you agree to our Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
}