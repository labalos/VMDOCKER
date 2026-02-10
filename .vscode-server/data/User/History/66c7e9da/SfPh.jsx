import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";
import Proyectos from "./Proyectos";  // ← Verificar esta línea

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/projects" element={<Proyectos />} />  {/* ← Usa Proyectos */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;