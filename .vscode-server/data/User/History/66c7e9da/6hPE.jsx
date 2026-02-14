// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import Formulario from './components/Formulario';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Proyectos from './Proyectos';
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/projects" element={<Proyectos />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin protegido con rutas anidadas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="solicitudes" element={<AdminSolicitudes />} />
          <Route path="*" element={<div>Admin: Ruta no encontrada</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default App;