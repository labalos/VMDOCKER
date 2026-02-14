import { useState } from "react";
import { Button, Input, Card, CardBody } from "./ui";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_API_BASE;

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('Enviando:', { email: credentials.email, password: '***' });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password 
        }),
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (!response.ok || !data.ok) {
        // El backend usa "error", no "message"
        throw new Error(data.error || `Error ${response.status}`);
      }

      // Guardar token
      if (!data.token) {
        throw new Error('No se recibió token del servidor');
      }

      localStorage.setItem("token", data.token);
      
      if (onLogin && data.usuario) {
        onLogin(data.usuario);
      }

      navigate("/admin");

    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <CardBody>
          <div className={styles.header}>
            <h1 className={styles.title}>Admin Login</h1>
            <p className={styles.subtitle}>Access the administration panel</p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <span>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}