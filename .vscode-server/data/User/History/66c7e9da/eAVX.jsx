// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import LandingPage from './pages/LandingPage';
import Formulario from './components/Formulario';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login'; // antes: ./components/Login
import Navbar from './components/Navbar';
import Proyectos from './Proyectos';
import AdminLayout from "./components/AdminLayout";






function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* PÚBLICO */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </Router>
  );
}

// Rutas públicas
function PublicRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />
        <Route path="/login" element={<Login />} /> {/* quitar onLogin */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Rutas admin protegidas
function AdminRoutes() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solicitudes" element={<AdminSolicitudes />} />
          <Route path="*" element={<div>Admin: Ruta no encontrada</div>} />
        </Routes>
      </AdminLayout>
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