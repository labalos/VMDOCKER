// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import Formulario from './components/Formulario';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Proyectos from './Proyectos'; // ← NUEVO IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Router>
  );
}

// Rutas públicas (con Navbar)
function PublicRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} /> {/* ← CAMBIADO */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Rutas de admin (protegidas, sin Navbar público)
function AdminRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<AdminSolicitudes />} />
        <Route path="*" element={<div>Admin: Ruta no encontrada</div>} />
      </Routes>
    </ProtectedRoute>
  );
}

// Página 404
function NotFound() {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default App;