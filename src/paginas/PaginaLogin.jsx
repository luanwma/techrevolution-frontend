import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAutenticacao } from "../contexto/AutenticacaoContexto";
import { cadastrarGerente, login } from "../servicos/servicoAutenticacao";

export function PaginaLogin() {
  const navigate = useNavigate();
  const { autenticado, usuario, entrar } = useAutenticacao();
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  if (autenticado && usuario?.role === "GERENTE") {
    return <Navigate to="/gerente" replace />;
  }

  if (autenticado && usuario?.role === "DESENVOLVEDOR") {
    return <Navigate to="/desenvolvedor" replace />;
  }

  const enviar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      if (modo === "cadastro") {
        await cadastrarGerente(nome, email, senha);
        setModo("login");
        setNome("");
        setSenha("");
        setSucesso("Gerente cadastrado com sucesso. Faça login para continuar.");
      } else {
        const resposta = await login(email, senha);
        entrar(resposta);
        if (resposta.usuarioResponse?.role === "GERENTE") {
          navigate("/gerente");
        } else {
          navigate("/desenvolvedor");
        }
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="tela-login">
      <section className="painel-login">
        <h1>Gestão de Tarefas</h1>
        <p>
          {modo === "login"
            ? "Acesso único para gerente e desenvolvedor."
            : "Cadastre o gerente principal para iniciar o sistema."}
        </p>

        <form onSubmit={enviar} className="formulario">
          {modo === "cadastro" && (
            <label className="campo">
              Nome
              <input
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Nome do gerente"
                required
              />
            </label>
          )}

          <label className="campo">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="nome@empresa.com"
              required
            />
          </label>

          <label className="campo">
            Senha
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>

          {erro && <p className="erro-texto">{erro}</p>}
          {sucesso && <p className="sucesso-texto">{sucesso}</p>}

          <button className="botao botao-primario botao-largo" type="submit" disabled={carregando}>
            {carregando ? "Processando..." : modo === "login" ? "Entrar" : "Cadastrar gerente"}
          </button>
        </form>

        <div className="alternador-login">
          {modo === "login" ? (
            <button
              type="button"
              className="botao-link"
              onClick={() => {
                setModo("cadastro");
                setErro("");
                setSucesso("");
              }}
            >
              Primeiro acesso? Cadastrar gerente
            </button>
          ) : (
            <button
              type="button"
              className="botao-link"
              onClick={() => {
                setModo("login");
                setErro("");
                setSucesso("");
              }}
            >
              Já tem conta? Voltar para login
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
