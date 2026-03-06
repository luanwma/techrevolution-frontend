import { formatarDataHora } from "../../util/formatacao";

const textoPrioridade = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  ALTA: "Alta",
  URGENTE: "Urgente"
};

export function CardTarefa({
  tarefa,
  perfil,
  onIniciar,
  onPausar,
  onFinalizar,
  onEditar,
  onExcluir,
  onVerHistorico,
  onArrastar
}) {
  const status = tarefa.tarefaStatus;
  const podeIniciar = status === "TODO" || status === "PAUSED";
  const podePausar = status === "DOING";
  const podeFinalizar = status === "DOING" || status === "PAUSED";

  return (
    <article className="card-tarefa" draggable onDragStart={(evento) => onArrastar(evento, tarefa.id)}>
      <header className="card-cabecalho">
        <h4>{tarefa.titulo}</h4>
        <span className={`chip-prioridade prioridade-${(tarefa.prioridade || "NORMAL").toLowerCase()}`}>
          {textoPrioridade[tarefa.prioridade] || tarefa.prioridade}
        </span>
      </header>

      <p className="card-descricao">{tarefa.descricao}</p>

      <div className="card-meta">
        <span>
          Prazo:
          {" "}
          {formatarDataHora(tarefa.prazoFinal)}
        </span>
        {tarefa.categoria?.nome && (
          <span className="chip-categoria" style={{ backgroundColor: tarefa.categoria.hexadecimal || "#1f4eb4" }}>
            {tarefa.categoria.nome}
          </span>
        )}
      </div>

      {Boolean(tarefa.etiquetas?.length) && (
        <div className="lista-etiquetas">
          {tarefa.etiquetas.map((etiqueta) => (
            <span key={etiqueta.id || etiqueta.descricao} className="chip-etiqueta">
              {etiqueta.descricao}
            </span>
          ))}
        </div>
      )}

      {perfil === "DESENVOLVEDOR" && (
        <div className="card-acoes">
          {podeIniciar && (
            <button className="botao-icone botao-play" title="Iniciar tarefa" onClick={() => onIniciar(tarefa)}>
              ▶
            </button>
          )}
          {podePausar && (
            <button className="botao-icone botao-pause" title="Pausar tarefa" onClick={() => onPausar(tarefa)}>
              ❚❚
            </button>
          )}
          {podeFinalizar && (
            <button className="botao botao-sucesso" onClick={() => onFinalizar(tarefa)}>
              Finalizar
            </button>
          )}
        </div>
      )}

      {perfil === "GERENTE" && (
        <div className="card-acoes">
          <button className="botao botao-secundario" onClick={() => onEditar(tarefa)}>
            Editar
          </button>
          <button className="botao botao-alerta" onClick={() => onExcluir(tarefa)}>
            Excluir
          </button>
          <button className="botao botao-primario" onClick={() => onVerHistorico(tarefa)}>
            Histórico
          </button>
        </div>
      )}
    </article>
  );
}
