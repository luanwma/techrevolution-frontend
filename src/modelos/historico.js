export class Historico {
  constructor({
    id,
    executorId,
    nomeExecutor,
    tarefaId,
    nomeTarefa,
    totalTempoSegundos,
    prazoDado,
    iniciadaEm,
    finalizadaEm,
    detalhesExecucao
  }) {
    this.id = id;
    this.executorId = executorId;
    this.nomeExecutor = nomeExecutor;
    this.tarefaId = tarefaId;
    this.nomeTarefa = nomeTarefa;
    this.totalTempoSegundos = totalTempoSegundos;
    this.prazoDado = prazoDado;
    this.iniciadaEm = iniciadaEm;
    this.finalizadaEm = finalizadaEm;
    this.detalhesExecucao = detalhesExecucao;
  }

  static deApi(api) {
    return new Historico({
      id: api.id,
      executorId: api.executorId,
      nomeExecutor: api.nomeExecutor,
      tarefaId: api.tarefaId,
      nomeTarefa: api.nomeTarefa,
      totalTempoSegundos: Number(api.totalTempoSegundos || 0),
      prazoDado: api.prazoDado,
      iniciadaEm: api.iniciadaEm,
      finalizadaEm: api.finalizadaEm,
      detalhesExecucao: api.detalhesExecucao || ""
    });
  }
}
