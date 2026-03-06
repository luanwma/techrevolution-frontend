import { CardTarefa } from "./CardTarefa";

export function ColunaKanban({
  titulo,
  statusColuna,
  tarefas,
  perfil,
  onIniciar,
  onPausar,
  onFinalizar,
  onEditar,
  onExcluir,
  onVerHistorico,
  onSoltarTarefa,
  onArrastar
}) {
  const permitirDrop = (evento) => {
    evento.preventDefault();
  };

  const soltar = (evento) => {
    evento.preventDefault();
    const tarefaId = evento.dataTransfer.getData("text/plain");
    if (tarefaId) {
      onSoltarTarefa(tarefaId, statusColuna);
    }
  };

  return (
    <section className="coluna-kanban" onDragOver={permitirDrop} onDrop={soltar}>
      <header className="coluna-cabecalho">
        <h3>{titulo}</h3>
        <span>{tarefas.length}</span>
      </header>
      <div className="coluna-conteudo">
        {tarefas.map((tarefa) => (
          <CardTarefa
            key={tarefa.id}
            tarefa={tarefa}
            perfil={perfil}
            onIniciar={onIniciar}
            onPausar={onPausar}
            onFinalizar={onFinalizar}
            onEditar={onEditar}
            onExcluir={onExcluir}
            onVerHistorico={onVerHistorico}
            onArrastar={onArrastar}
          />
        ))}
      </div>
    </section>
  );
}
