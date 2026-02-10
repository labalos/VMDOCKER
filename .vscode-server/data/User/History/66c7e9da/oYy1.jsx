// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // ✅ Agrega Link
import './App.css';

// Importa TODOS los componentes
import LandingPage from './pages/LandingPage';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import Formulario from './components/Formulario';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Proyectos from './Proyectos'; // Si tienes este componente

function App() {
  return (
    <Router>
      {/* Navbar aparece en todas las páginas EXCEPTO admin */}
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  );
}

// Layout principal (público)
function MainLayout() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/admin');
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Layout de administración (protegido)
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

// Página 404
function NotFound() {
  return (
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
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Página no encontrada</h2>
      <p style={{ marginBottom: '30px', color: '#7f8c8d', maxWidth: '600px' }}>
        La ruta que buscas no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '12px 30px',
          background: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#2980b9';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#3498db';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}

// Página de proyectos (si no tienes el componente)
function ProjectsPage() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Navbar />
      <div style={{ marginTop: '80px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#2c3e50' }}>Our Projects</h1>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d', marginBottom: '40px' }}>
          Aquí puedes ver algunos de nuestros trabajos realizados.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '200px',
                background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                🏗️
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Project {item}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.95rem', marginBottom: '15px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Link 
                  to="/formulario"
                  style={{
                    display: 'inline-block',
                    color: '#3498db',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Solicitar presupuesto →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <Link 
            to="/formulario"
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🏗️ Solicita tu proyecto personalizado
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;