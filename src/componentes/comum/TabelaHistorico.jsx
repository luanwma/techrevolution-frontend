import { formatarDataHora, formatarSegundos } from "../../util/formatacao";

export function TabelaHistorico({ historicos, vazioTexto = "Sem histórico para exibir." }) {
  if (!historicos.length) {
    return <p className="vazio">{vazioTexto}</p>;
  }

  return (
    <div className="tabela-container">
      <table className="tabela-historico">
        <thead>
          <tr>
            <th>Executor</th>
            <th>Tarefa</th>
            <th>Tempo</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Prazo</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          {historicos.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.nomeExecutor}</td>
              <td>{registro.nomeTarefa}</td>
              <td>{formatarSegundos(registro.totalTempoSegundos)}</td>
              <td>{formatarDataHora(registro.iniciadaEm)}</td>
              <td>{formatarDataHora(registro.finalizadaEm)}</td>
              <td>{formatarDataHora(registro.prazoDado)}</td>
              <td>{registro.detalhesExecucao || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
