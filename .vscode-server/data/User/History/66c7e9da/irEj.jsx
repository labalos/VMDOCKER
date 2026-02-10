import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protegida - Admin */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;