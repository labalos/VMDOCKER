// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importa TODOS tus componentes
import LandingPage from './pages/LandingPage';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import Formulario from './components/Formulario';  // ✅ Añade esto
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública principal */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta pública del formulario de contacto */}
        <Route path="/formulario" element={<Formulario />} />  {/* ✅ Añade esta línea */}
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/solicitudes" element={
          <ProtectedRoute>
            <AdminSolicitudes />
          </ProtectedRoute>
        } />
        
        {/* Ruta 404 - Para cualquier otra ruta no definida */}
        <Route path="*" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>404 - Página no encontrada</h1>
            <p>La ruta que buscas no existe.</p>
            <a href="/">Volver al inicio</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;