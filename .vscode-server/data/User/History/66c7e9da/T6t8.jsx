import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página pública principal */}
        <Route path="/" element={<Hero />} />
        
        {/* Páginas públicas */}
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