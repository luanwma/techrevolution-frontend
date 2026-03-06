export function agruparProdutividadePorExecutor(historicos) {
  const mapa = new Map();

  historicos.forEach((item) => {
    const chave = item.executorId;
    if (!mapa.has(chave)) {
      mapa.set(chave, {
        executorId: item.executorId,
        nomeExecutor: item.nomeExecutor,
        quantidadeTarefas: 0,
        tempoSegundos: 0
      });
    }

    const registro = mapa.get(chave);
    registro.quantidadeTarefas += 1;
    registro.tempoSegundos += Number(item.totalTempoSegundos || 0);
  });

  return Array.from(mapa.values()).sort((a, b) => b.quantidadeTarefas - a.quantidadeTarefas);
}

export function totalSegundos(historicos) {
  return historicos.reduce((acumulador, item) => acumulador + Number(item.totalTempoSegundos || 0), 0);
}
