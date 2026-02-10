import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Formulario from "./components/Formulario";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
      </Routes>
    </Router>
  );
}

export default App;