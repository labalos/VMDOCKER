import { useState } from "react";
import { Button, Input, Card, CardBody } from "./ui";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_API_BASE;

async function handleLogin(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Error ${response.status}`);
  }
  return response.json();
}

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Error ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      if (onLogin) onLogin(data.usuario);

      navigate("/admin");

    } catch (err) {
      setError(err.message);
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
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
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