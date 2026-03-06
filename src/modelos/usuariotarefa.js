export class UsuarioTarefa {
  constructor({
    tarefaId,
    executorId,
    startedAt = null,
    pausedAt = null,
    lastStartedAt = null,
    lastPausedAt = null,
    segundosTrabalhados = 0,
    detalhesExecucao = ""
  }) {
    this.tarefaId = tarefaId;
    this.executorId = executorId;
    this.startedAt = startedAt;
    this.pausedAt = pausedAt;
    this.lastStartedAt = lastStartedAt;
    this.lastPausedAt = lastPausedAt;
    this.segundosTrabalhados = segundosTrabalhados;
    this.detalhesExecucao = detalhesExecucao;
  }

  get tempoFormatado() {
    const total = Number(this.segundosTrabalhados || 0);
    const horas = String(Math.floor(total / 3600)).padStart(2, "0");
    const minutos = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const segundos = String(total % 60).padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
  }
}
