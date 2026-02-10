import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Formulario from "./components/Formulario";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;