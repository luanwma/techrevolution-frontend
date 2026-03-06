import { useNavigate } from "react-router-dom";
import { useAutenticacao } from "../../contexto/AutenticacaoContexto";

export function CabecalhoAplicacao({ titulo }) {
  const navigate = useNavigate();
  const { usuario, sair } = useAutenticacao();

  const rotaPainel = usuario?.role === "GERENTE" ? "/gerente" : "/desenvolvedor";

  const sairSistema = () => {
    sair();
    navigate("/login");
  };

  return (
    <header className="cabecalho-aplicacao">
      <div>
        <h1>{titulo}</h1>
        <p className="cabecalho-subtitulo">
          {usuario?.nome} · {usuario?.role === "GERENTE" ? "Gerente" : "Desenvolvedor"}
        </p>
      </div>

      <div className="cabecalho-acoes">
        <button className="botao botao-secundario" onClick={() => navigate(rotaPainel)}>
          Atualizar painel
        </button>
        <button className="botao botao-alerta" onClick={sairSistema}>
          Sair
        </button>
      </div>
    </header>
  );
}
