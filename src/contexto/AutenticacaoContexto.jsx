import { createContext, useContext, useMemo, useState } from "react";
import { Usuario } from "../modelos/usuario";

const CHAVE_AUTENTICACAO = "dadosAutenticacao";

const AutenticacaoContexto = createContext(null);

function carregarSessao() {
  try {
    const valor = localStorage.getItem(CHAVE_AUTENTICACAO);
    if (!valor) {
      return { token: null, usuario: null };
    }
    const dados = JSON.parse(valor);
    return {
      token: dados.token || null,
      usuario: dados.usuario ? Usuario.deApi(dados.usuario) : null
    };
  } catch {
    localStorage.removeItem(CHAVE_AUTENTICACAO);
    return { token: null, usuario: null };
  }
}

export function ProvedorAutenticacao({ children }) {
  const [sessao, setSessao] = useState(() => carregarSessao());

  const entrar = (authResponse) => {
    const token = authResponse?.token || null;
    const usuario = authResponse?.usuarioResponse
      ? Usuario.deApi(authResponse.usuarioResponse)
      : null;

    const novaSessao = { token, usuario };
    setSessao(novaSessao);
    localStorage.setItem(
      CHAVE_AUTENTICACAO,
      JSON.stringify({
        token: novaSessao.token,
        usuario: novaSessao.usuario
      })
    );
  };

  const sair = () => {
    setSessao({ token: null, usuario: null });
    localStorage.removeItem(CHAVE_AUTENTICACAO);
  };

  const valor = useMemo(
    () => ({
      token: sessao.token,
      usuario: sessao.usuario,
      autenticado: Boolean(sessao.token && sessao.usuario),
      entrar,
      sair
    }),
    [sessao.token, sessao.usuario]
  );

  return (
    <AutenticacaoContexto.Provider value={valor}>
      {children}
    </AutenticacaoContexto.Provider>
  );
}

export function useAutenticacao() {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) {
    throw new Error("useAutenticacao deve ser usado dentro do ProvedorAutenticacao");
  }
  return contexto;
}

export function obterTokenDaSessao() {
  try {
    const valor = localStorage.getItem(CHAVE_AUTENTICACAO);
    if (!valor) {
      return null;
    }
    const dados = JSON.parse(valor);
    return dados.token || null;
  } catch {
    return null;
  }
}
