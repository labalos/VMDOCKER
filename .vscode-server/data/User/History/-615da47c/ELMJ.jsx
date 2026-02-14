import { useState } from "react";
import { Button, Input, Card, CardBody } from "./ui";
import styles from "./Formulario.module.css";

const servicios = [
  "Construction",
  "Remodeling", 
  "Painting",
  "Flooring",
  "Other"
];

const BACKEND_URL = import.meta.env.VITE_API_BASE;

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    service: "",
    mensaje: "",
    ubicacion: "",
    presupuesto: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) return "Name is required";
    if (!formData.telefono.trim()) return "Phone number is required";
    
    const phoneRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
    if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      return "Please enter a valid phone number (8-20 digits)";
    }
    
    if (!formData.service) return "Please select a service";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const endpoint = BACKEND_URL + "/solicitudes";
      
      const requestData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        service: formData.service,
        mensaje: formData.mensaje.trim(),
        ubicacion: formData.ubicacion.trim(),
        presupuesto: formData.presupuesto.trim()
      };
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
        credentials: "include"
      });
      
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Error ${response.status}`);
      }
      if (!response.ok) {
        throw new Error(data.error || data.message || `Error ${response.status}`);
      }
      
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
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 15000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Request a Quote</h2>
        <p className={styles.subtitle}>
          Fill out the form and we'll contact you within 24 hours
        </p>
      </div>

      {success && (
        <div className={styles.successAlert}>
          <span className={styles.successIcon}>✓</span>
          <div>
            <strong>Thank you, {formData.nombre}!</strong>
            <p>We've received your request for {formData.service}. We'll contact you soon.</p>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <span>⚠</span>
          {error}
        </div>
      )}

      <Card className={styles.formCard}>
        <CardBody>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <Input
                label="Full Name *"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Phone Number *"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
                required
              />
              
              <div className={styles.selectGroup}>
                <label className={styles.selectLabel}>Service Required *</label>
                <select
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

            <div className={styles.formGrid}>
              <Input
                label="Project Location (Optional)"
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="City, State or Address"
              />
              
              <Input
                label="Estimated Budget (Optional)"
                type="text"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                placeholder="5000"
              />
            </div>

            <div className={styles.textareaGroup}>
              <label className={styles.textareaLabel}>Project Details</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Tell us about your project, timeline, specific requirements..."
                rows="4"
              />
            </div>

            <div className={styles.submitSection}>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Sending..." : "Send Request"}
              </Button>
              <p className={styles.disclaimer}>
                * Required fields. By submitting, you agree to our Privacy Policy.
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
