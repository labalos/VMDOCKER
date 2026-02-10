import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Si no hay token, redirige inmediatamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza el contenido protegido
  return children;
}