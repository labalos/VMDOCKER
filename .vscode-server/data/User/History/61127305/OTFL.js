// /home/leo/frontend/src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'; // Opcional: crea un CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Intentando login con:', { email: formData.email });
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('📦 Respuesta login:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      if (!data.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // ✅ Login exitoso - Guardar token
      localStorage.setItem('token', data.token);
      
      // Opcional: Guardar info de usuario
      if (data.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
      }

      console.log('✅ Login exitoso, token guardado');
      
      // Redirigir al panel de admin
      navigate('/admin');

    } catch (err) {
      console.error('❌ Error en login:', err);
      
      // Mensajes de error específicos
      let errorMessage = err.message;
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
      } else if (err.message.includes('401') || err.message.includes('Credenciales')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (err.message.includes('400')) {
        errorMessage = 'Datos inválidos';
      }
      
      setError(errorMessage);
      
      // Limpiar contraseña por seguridad
      setFormData(prev => ({ ...prev, password: '' }));
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>🔐 Admin Login</h1>
          <p className={styles.subtitle}>
            Acceso al panel de administración
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@ejemplo.com"
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={styles.input}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Verificando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>💡 Información</h3>
          <ul className={styles.infoList}>
            <li>Usa las credenciales de tu usuario admin</li>
            <li>El backend debe estar corriendo en puerto 3000</li>
            <li>Si no tienes usuario, crea uno en la base de datos</li>
          </ul>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Problemas? Verifica que el backend esté activo
          </p>
          <Link to="/" className={styles.homeLink}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}