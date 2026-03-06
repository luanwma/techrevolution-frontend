import { clienteApi } from "./clienteApi";

export async function login(email, senha) {
  const { data } = await clienteApi.post("/api/auth/login", { email, senha });
  return data;
}

export async function cadastrarGerente(nome, email, senha) {
  const { data } = await clienteApi.post("/api/gerente/registro", { nome, email, senha });
  return data;
}
