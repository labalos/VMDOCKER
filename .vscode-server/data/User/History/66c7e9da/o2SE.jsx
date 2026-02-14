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
        {/* Layout público con Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/projects" element={<Proyectos />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMIN protegido */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/solicitudes" element={<AdminSolicitudes />} />
                  <Route path="*" element={<div>Admin: Ruta no encontrada</div>} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Layout público con Navbar + Outlet
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
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