
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Opcional: Verificar token con backend
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          headers: { 'x-token': token }
        });
        
        if (!response.ok) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);
  
  return children;
}