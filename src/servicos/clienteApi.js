import axios from "axios";
import { obterTokenDaSessao } from "../contexto/AutenticacaoContexto";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const rotasPublicas = new Set(["/api/auth/login", "/api/gerente/registro"]);

export const clienteApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

clienteApi.interceptors.request.use((config) => {
  const caminho = config?.url?.split("?")[0] || "";
  if (rotasPublicas.has(caminho)) {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const token = obterTokenDaSessao();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clienteApi.interceptors.response.use(
  (response) => response,
  (erro) => {
    const mensagemApi =
      erro?.response?.data?.mensagem ||
      erro?.response?.data?.erro ||
      erro?.message ||
      "Erro inesperado na comunicação com a API.";
    return Promise.reject(new Error(mensagemApi));
  }
);
