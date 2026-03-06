import { ColunaKanban } from "./ColunaKanban";
import { normalizarStatusParaColuna } from "../../util/formatacao";

const colunas = [
  { status: "TODO", titulo: "A Fazer" },
  { status: "DOING", titulo: "Em Execução" },
  { status: "DONE", titulo: "Concluídas" }
];

export function QuadroKanban({
  tarefas,
  perfil,
  onIniciar,
  onPausar,
  onFinalizar,
  onEditar,
  onExcluir,
  onVerHistorico,
  onSoltarTarefa
}) {
  const mapa = colunas.reduce((acumulador, coluna) => {
    acumulador[coluna.status] = [];
    return acumulador;
  }, {});

  tarefas.forEach((tarefa) => {
    const statusColuna = normalizarStatusParaColuna(tarefa.tarefaStatus);
    if (!mapa[statusColuna]) {
      mapa[statusColuna] = [];
    }
    mapa[statusColuna].push(tarefa);
  });

  const arrastar = (evento, tarefaId) => {
    evento.dataTransfer.setData("text/plain", tarefaId);
  };

  return (
    <div className="kanban">
      {colunas.map((coluna) => (
        <ColunaKanban
          key={coluna.status}
          titulo={coluna.titulo}
          statusColuna={coluna.status}
          tarefas={mapa[coluna.status] || []}
          perfil={perfil}
          onIniciar={onIniciar}
          onPausar={onPausar}
          onFinalizar={onFinalizar}
          onEditar={onEditar}
          onExcluir={onExcluir}
          onVerHistorico={onVerHistorico}
          onSoltarTarefa={onSoltarTarefa}
          onArrastar={arrastar}
        />
      ))}
    </div>
  );
}
