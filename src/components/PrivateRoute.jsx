import { Navigate } from "react-router-dom";

// Simples verificação - você pode melhorar com contexto de autenticação
const isAuthenticated = () => {
  return localStorage.getItem("usuario") !== null;
};

export default function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}