import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";        // NUEVO
import Hero from "./components/Hero";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";

function App() {
  return (
    <Router>
      <Navbar />  {/* NUEVO - Aparece en todas las páginas */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;