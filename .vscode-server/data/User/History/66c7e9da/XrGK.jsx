import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";           // Nuevo
import Home from "./Home";                       // Tu Home actual (para admin)
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";            // Tu galería

function App() {
  return (
    <Router>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Hero />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />
        
        {/* Admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;