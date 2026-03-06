import { Historico } from "../modelos/historico";
import { clienteApi } from "./clienteApi";

export async function buscarHistoricoGerente() {
  const { data } = await clienteApi.get("/api/historico/gerente");
  return data.map(Historico.deApi);
}

export async function buscarHistoricoPorDesenvolvedor(executorId) {
  const { data } = await clienteApi.get(`/api/historico/desenvolvedor/${executorId}`);
  return data.map(Historico.deApi);
}

export async function buscarHistoricoPorTarefa(tarefaId) {
  const { data } = await clienteApi.get(`/api/historico/tarefa/${tarefaId}`);
  return data.map(Historico.deApi);
}
