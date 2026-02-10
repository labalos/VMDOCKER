import { useState } from "react";
import styles from "./Formulario.module.css";

// Servicios disponibles
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

  //  FUNCIÓN handleSubmit 
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
      console.log(" DEBUG: Iniciando envío del formulario...");
      
      // URL del backend - IMPORTANTE
      const BACKEND_URL = "http://localhost:3000";
      const endpoint = BACKEND_URL + "/api/solicitudes";
      
      console.log(" URL de destino:", endpoint);
      
      // Datos a enviar
      const requestData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        service: formData.service,
        mensaje: formData.mensaje.trim(),
        ubicacion: formData.ubicacion.trim(),
        presupuesto: formData.presupuesto.trim()
      };
      
      console.log(" Datos a enviar:", requestData);
      
      // Configuración de la petición
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
        mode: "cors", // Añadir modo cors explícitamente
        credentials: "include" // Para cookies si las usas
      };
      
      console.log(" Configuración fetch:", fetchOptions);
      
      // Intentar la petición
      let response;
      try {
        console.log("🌐 Intentando conectar con el backend...");
        response = await fetch(endpoint, fetchOptions);
        console.log("✅ Conexión establecida, status:", response.status);
      } catch (fetchError) {
        console.error("❌ ERROR DE CONEXIÓN:", fetchError);
        throw new Error(`No se puede conectar al servidor. 
          Verifica:
          1. El backend está corriendo en http://localhost:3000
          2. El comando 'curl http://localhost:3000' funciona
          3. No hay firewalls bloqueando el puerto 3000
          4. Error: ${fetchError.message}`);
      }
      
      console.log("📊 Response status:", response.status, response.statusText);
      
      // Intentar leer la respuesta
      let responseText;
      try {
        responseText = await response.text();
        console.log("📦 Respuesta recibida (primeros 500 chars):", 
          responseText.substring(0, 500));
      } catch (textError) {
        console.error("❌ Error leyendo respuesta:", textError);
        throw new Error("El servidor respondió pero no se pudo leer la respuesta");
      }
      
      // Parsear JSON si hay contenido
      let data = {};
      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
          console.log("✅ JSON parseado:", data);
        } catch (parseError) {
          console.warn("⚠️ No es JSON válido:", responseText);
          data = { message: responseText };
        }
      }
      
      // Verificar si es error HTTP
      if (!response.ok) {
        const errorMsg = data.error || data.message || 
                        data.details || 
                        `Error HTTP ${response.status}: ${response.statusText}`;
        console.error("❌ Error del servidor:", errorMsg);
        throw new Error(errorMsg);
      }
      
      // ÉXITO
      console.log("🎉 ¡Formulario enviado con éxito!");
      setSuccess(true);
      
      // Resetear formulario
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        service: "",
        mensaje: "",
        ubicacion: "",
        presupuesto: ""
      });
      
      // Auto-ocultar mensaje
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      console.error("🔥 ERROR COMPLETO:", err);
      console.error("📜 Stack:", err.stack);
      
      // Mostrar error detallado
      setError(err.message);
      
      // Auto-ocultar error
      setTimeout(() => setError(""), 15000);
      
    } finally {
      setLoading(false);
      console.log("🏁 handleSubmit finalizado");
    }
  };

  return (
    <div className={styles.container} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div className={styles.header} style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}>
        <h2 className={styles.title}>Request a Quote</h2>
        <p className={styles.subtitle}>
          Fill out the form and we'll contact you within 24 hours
        </p>
      </div>

      {success && (
        <div className={styles.successMessage} style={{
          background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '800px',
          width: '100%',
          animation: 'fadeIn 0.5s ease'
        }}>
          <span style={{ fontSize: '2rem', marginRight: '15px', fontWeight: 'bold' }}>✓</span>
          <div>
            <strong>Thank you, {formData.nombre}!</strong>
            <p>We've received your request for {formData.service}. We'll contact you soon.</p>
            <small>You should receive a confirmation email shortly.</small>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '800px',
          width: '100%',
          animation: 'fadeIn 0.5s ease'
        }}>
          <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form} style={{
        maxWidth: '800px',
        width: '100%',
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Campos principales */}
        <div className={styles.formRow} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          marginBottom: '25px'
        }}>
          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="nombre" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={styles.input}
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="John Smith"
              required
            />
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className={styles.formRow} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          marginBottom: '25px'
        }}>
          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="telefono" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={styles.input}
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="+1 (123) 456-7890"
              required
            />
            <small className={styles.helperText} style={{
              fontSize: '0.85rem',
              color: '#95a5a6',
              marginTop: '5px'
            }}>
              Include country code if international
            </small>
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="service" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Service Required *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={styles.select}
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237f8c8d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 15px center',
                backgroundSize: '15px',
                paddingRight: '45px'
              }}
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

        {/* Nuevos campos opcionales */}
        <div className={styles.formRow} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          marginBottom: '25px'
        }}>
          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="ubicacion" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Project Location (Optional)
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className={styles.input}
              style={{
                padding: '12px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              placeholder="City, State or Address"
            />
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="presupuesto" className={styles.label} style={{
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              Estimated Budget (Optional)
            </label>
            <div className={styles.inputGroup} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span className={styles.currency} style={{
                position: 'absolute',
                left: '15px',
                color: '#7f8c8d',
                fontWeight: '600'
              }}>$</span>
              <input
                type="text"
                id="presupuesto"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                className={`${styles.input} ${styles.budgetInput}`}
                style={{
                  padding: '12px 15px 12px 35px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                placeholder="5000"
              />
            </div>
            <small className={styles.helperText} style={{
              fontSize: '0.85rem',
              color: '#95a5a6',
              marginTop: '5px'
            }}>
              Approximate amount in USD
            </small>
          </div>
        </div>

        {/* Campo mensaje */}
        <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', marginBottom: '25px' }}>
          <label htmlFor="mensaje" className={styles.label} style={{
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '8px',
            fontSize: '0.95rem'
          }}>
            Project Details
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            className={styles.textarea}
            style={{
              padding: '12px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              minHeight: '120px',
              fontFamily: 'inherit'
            }}
            placeholder="Tell us about your project, timeline, specific requirements..."
            rows="4"
          />
          <small className={styles.helperText} style={{
            fontSize: '0.85rem',
            color: '#95a5a6',
            marginTop: '5px'
          }}>
            The more details you provide, the better we can help you
          </small>
        </div>

        {/* Botón de envío */}
        <div className={styles.submitContainer} style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            type="submit"
            className={styles.submitButton}
            style={{
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '180px'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <span className={styles.spinner} style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  borderTopColor: 'white',
                  animation: 'spin 1s ease-in-out infinite',
                  marginRight: '10px'
                }}></span>
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
          <p className={styles.disclaimer} style={{
            fontSize: '0.85rem',
            color: '#95a5a6',
            marginTop: '15px'
          }}>
            * Required fields. By submitting, you agree to our Privacy Policy.
          </p>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .formRow {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          form {
            padding: 25px !important;
          }
        }
        
        @media (max-width: 480px) {
          form {
            padding: 20px !important;
            border-radius: 10px !important;
          }
          
          button {
            width: 100% !important;
          }
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none !important;
          border-color: #3498db !important;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1) !important;
        }
      `}</style>
    </div>
  );
}