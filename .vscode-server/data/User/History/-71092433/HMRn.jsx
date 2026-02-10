
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificación SIMPLE: solo chequea si existe el token
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    }
    
    // ✅ OPCIÓN ADICIONAL: Verificación básica del formato del token
    // (sin llamar al backend)
    try {
      // Si es un token JWT, debería tener 3 partes separadas por puntos
      if (token.includes('.')) {
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.warn('Formato de token inválido');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
      // Si no es JWT, asumimos que es válido para desarrollo
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
    
  }, [navigate]);
  
  return children;
}