// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importa TODOS los componentes
import LandingPage from './pages/LandingPage';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import Formulario from './components/Formulario';  // ✅ IMPORTANTE
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Navbar from './components/Navbar';  // Si usas Navbar en todas las páginas

function App() {
  return (
    <Router>
      {/* Si quieres Navbar en TODAS las páginas, ponlo aquí */}
      {/* <Navbar /> */}
      
      <Routes>
        {/* Ruta pública principal */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta pública del formulario de contacto */}
        <Route path="/formulario" element={<Formulario />} />  {/* ✅ ESTA ES LA CLAVE */}
        
        {/* Si tienes página de proyectos pública */}
        <Route path="/projects" element={
          <div style={{ padding: '50px' }}>
            <h1>Projects Page</h1>
            <p>Esta página aún no está implementada.</p>
            <Link to="/">Volver al inicio</Link>
          </div>
        } />
        
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