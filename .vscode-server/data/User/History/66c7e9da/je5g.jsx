// /home/leo/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import Home from './Home';
import AdminSolicitudes from './components/AdminSolicitudes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
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
      </Routes>
    </Router>
  );
}

export default App;