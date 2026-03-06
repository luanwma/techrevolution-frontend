import { Navigate, useLocation } from "react-router-dom";
import { useAutenticacao } from "../contexto/AutenticacaoContexto";

export function RotaProtegida({ perfisPermitidos, children }) {
  const { autenticado, usuario } = useAutenticacao();
  const localizacao = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" state={{ de: localizacao }} replace />;
  }

  if (perfisPermitidos?.length && !perfisPermitidos.includes(usuario.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
