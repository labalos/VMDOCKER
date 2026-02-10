// /home/leo/frontend/src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    }
    
    // ✅ OPCIÓN: Verificar token decodificándolo (sin llamar al backend)
    try {
      // Decodificar el token JWT para ver si está expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      // Si hay error decodificando, token inválido
      localStorage.removeItem('token');
      navigate('/login');
    }
    
  }, [navigate]);
  
  return children;
}