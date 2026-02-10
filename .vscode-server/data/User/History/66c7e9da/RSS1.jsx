import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";
import styles from "./App.module.css";

// Wrapper que agrega padding según la ruta
function PageWrapper({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  
  // Solo padding si NO es landing (el Hero ya maneja su espacio)
  return (
    <div className={isLanding ? "" : styles.pageContent}>
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/projects" element={<Proyectos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;