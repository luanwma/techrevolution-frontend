import { useEffect, useState } from "react";

export function ModalDetalhesExecucao({
  aberto,
  titulo,
  obrigatorio = false,
  carregando = false,
  onCancelar,
  onConfirmar
}) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (aberto) {
      setTexto("");
    }
  }, [aberto]);

  if (!aberto) {
    return null;
  }

  const confirmar = () => {
    if (obrigatorio && !texto.trim()) {
      return;
    }
    onConfirmar(texto.trim());
  };

  return (
    <div className="modal-fundo">
      <div className="modal-conteudo">
        <h3>{titulo}</h3>
        <p>Registre uma observação sobre a execução da tarefa.</p>
        <textarea
          className="campo-textarea"
          rows={5}
          placeholder="Descreva o andamento, bloqueio ou resultado..."
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
        <div className="modal-acoes">
          <button className="botao botao-secundario" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </button>
          <button
            className="botao botao-primario"
            onClick={confirmar}
            disabled={carregando || (obrigatorio && !texto.trim())}
          >
            {carregando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
