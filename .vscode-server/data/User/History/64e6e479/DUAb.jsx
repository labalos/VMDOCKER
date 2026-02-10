import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
  <h2 className="mb-4">Iniciar Sesión</h2>

  <form>
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