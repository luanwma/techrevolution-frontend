import { Tarefa } from "../modelos/tarefa";
import { clienteApi } from "./clienteApi";

export async function buscarTarefasDashboard() {
  const { data } = await clienteApi.get("/api/tarefas/dashboard");
  return data.map(Tarefa.deApi);
}

export async function criarTarefa(payload) {
  const { data } = await clienteApi.post("/api/tarefas/criar", payload);
  return Tarefa.deApi(data);
}

export async function editarTarefa(tarefaId, payload) {
  const { data } = await clienteApi.put(`/api/tarefas/editar/${tarefaId}`, payload);
  return Tarefa.deApi(data);
}

export async function deletarTarefa(tarefaId) {
  await clienteApi.delete(`/api/tarefas/deletar/${tarefaId}/`);
}

export async function iniciarTarefa(tarefaId) {
  await clienteApi.post(`/api/tarefas/${tarefaId}/iniciar`);
}

export async function pausarTarefa(tarefaId, detalhesExecucao) {
  await clienteApi.post(`/api/tarefas/${tarefaId}/pausar`, { detalhesExecucao });
}

export async function finalizarTarefa(tarefaId, detalhesExecucao) {
  await clienteApi.post(`/api/tarefas/${tarefaId}/finalizar`, { detalhesExecucao });
}
