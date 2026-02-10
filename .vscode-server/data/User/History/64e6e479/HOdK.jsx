import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }
  
      // Guardar token
      localStorage.setItem("token", data.token);
  
      // Redirigir a la página principal
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  };
  
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
  <h2 className="mb-4">Iniciar Sesión</h2>

  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Password</label>
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button type="submit" className="btn btn-primary w-100">
      Entrar
    </button>
  </form>
</div>
  );
}

export default Login;