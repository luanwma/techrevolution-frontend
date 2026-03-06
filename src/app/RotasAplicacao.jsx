import { Navigate, Route, Routes } from "react-router-dom";
import { RotaProtegida } from "./RotaProtegida";
import { useAutenticacao } from "../contexto/AutenticacaoContexto";
import { PaginaLogin } from "../paginas/PaginaLogin";
import { PainelGerente } from "../paginas/gerente/PainelGerente";
import { PainelDesenvolvedor } from "../paginas/desenvolvedor/PainelDesenvolvedor";
import { PaginaNaoEncontrada } from "../paginas/PaginaNaoEncontrada";

function RotaInicial() {
  const { autenticado, usuario } = useAutenticacao();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.role === "GERENTE") {
    return <Navigate to="/gerente" replace />;
  }

  return <Navigate to="/desenvolvedor" replace />;
}

export function RotasAplicacao() {
  return (
    <Routes>
      <Route path="/" element={<RotaInicial />} />
      <Route path="/login" element={<PaginaLogin />} />
      <Route
        path="/gerente"
        element={
          <RotaProtegida perfisPermitidos={["GERENTE"]}>
            <PainelGerente />
          </RotaProtegida>
        }
      />
      <Route
        path="/desenvolvedor"
        element={
          <RotaProtegida perfisPermitidos={["DESENVOLVEDOR"]}>
            <PainelDesenvolvedor />
          </RotaProtegida>
        }
      />
      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Routes>
  );
}
