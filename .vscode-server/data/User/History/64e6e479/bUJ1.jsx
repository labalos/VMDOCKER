import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 [LOGIN] Iniciando login...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📊 Status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📦 Respuesta (primeros 300 chars):', 
        responseText.substring(0, 300) + (responseText.length > 300 ? '...' : '')
      );

      let data = {};
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
          console.log('✅ JSON parseado:', Object.keys(data));
        } catch (parseError) {
          console.error('❌ Error parseando JSON:', parseError);
          throw new Error('Respuesta inválida del servidor');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `Error ${response.status}`);
      }

      // Buscar token en diferentes formatos
      const token = data.token || data.access_token || data.jwt || data.jwtToken;
      
      if (!token) {
        console.error('❌ No se encontró token:', data);
        throw new Error('El servidor no devolvió un token de autenticación');
      }

      console.log('✅ Token encontrado, guardando...');
      localStorage.setItem('token', token);
      
      if (data.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
      }

      // Pequeña pausa y redirigir
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/admin');

    } catch (err) {
      console.error('🔥 Error en login:', err);
      
      let errorMessage = err.message;
      
      if (err.name === 'AbortError') {
        errorMessage = 'Timeout: El servidor no respondió. Verifica que el backend esté corriendo.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'No se puede conectar al servidor. ¿El backend está en http://localhost:3000?';
      } else if (err.message.includes('401') || err.message.toLowerCase().includes('credencial')) {
        errorMessage = 'Email o contraseña incorrectos';
      }
      
      setError(errorMessage);
      setFormData(prev => ({ ...prev, password: '' }));
      
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '450px',
      padding: '40px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      color: '#2c3e50',
      fontSize: '2rem',
      marginBottom: '8px',
      fontWeight: '700'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '1rem'
    },
    errorAlert: {
      background: '#ffeaea',
      color: '#c0392b',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '25px',
      borderLeft: '4px solid #c0392b',
      whiteSpace: 'pre-line'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    spinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderRadius: '50%',
      borderTopColor: 'white',
      animation: 'spin 1s ease-in-out infinite'
    },
    infoBox: {
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '25px',
      borderLeft: '4px solid #3498db'
    },
    infoTitle: {
      color: '#2c3e50',
      fontSize: '1.1rem',
      marginBottom: '10px',
      fontWeight: '600'
    },
    footer: {
      textAlign: 'center',
      marginTop: '25px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    homeLink: {
      color: '#3498db',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '0.95rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 Admin Login</h1>
          <p style={styles.subtitle}>Acceso al panel de administración</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={{ marginRight: '10px' }}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@ejemplo.com"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Verificando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>💡 Para desarrollo</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#5a6268' }}>
            <li>Verifica que el backend esté corriendo</li>
            <li>Ruta esperada: POST /api/auth/login</li>
            <li>Respuesta: {"{ ok: true, token: '...' }"}</li>
          </ul>
        </div>

        <div style={styles.footer}>
          <Link to="/" style={styles.homeLink}>
            ← Volver al inicio
          </Link>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          input:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }
          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
}