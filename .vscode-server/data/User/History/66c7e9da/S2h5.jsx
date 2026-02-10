// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';

// Importa TODOS los componentes
import LandingPage from './pages/LandingPage';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import Formulario from './components/Formulario';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con Navbar */}
        <Route path="/*" element={<MainLayout />} />
        
        {/* Rutas de administración (sin Navbar público) */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

// Layout principal (público) - CORREGIDO
function MainLayout() {
  const location = useLocation(); // ✅ Ahora está importado
  const showNavbar = !location.pathname.startsWith('/admin');
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Layout de administración
function AdminLayout() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<AdminSolicitudes />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}

// Página de proyectos
function ProjectsPage() {
  return (
    <>
      <Navbar />
      <div style={{ 
        padding: '80px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: '70vh'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Our Projects</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Discover our latest construction and remodeling projects.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '30px',
          marginTop: '40px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'transform 0.3s'
            }}>
              <div style={{
                height: '200px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🏗️
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Project {item}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Residential construction project completed in 2024.
                </p>
                <Link 
                  to="/formulario"
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}
                >
                  Request Quote →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Página 404
function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '20px' }}>404</h1>
        <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ marginBottom: '30px', color: '#666', maxWidth: '500px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          style={{
            padding: '12px 30px',
            background: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
}

export default App;