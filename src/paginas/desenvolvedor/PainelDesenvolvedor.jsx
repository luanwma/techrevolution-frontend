import { useCallback, useEffect, useMemo, useState } from "react";
import { CabecalhoAplicacao } from "../../componentes/comum/CabecalhoAplicacao";
import { ModalDetalhesExecucao } from "../../componentes/comum/ModalDetalhesExecucao";
import { Carregando } from "../../componentes/comum/Carregando";
import { QuadroKanban } from "../../componentes/kanban/QuadroKanban";
import {
  buscarTarefasDashboard,
  finalizarTarefa,
  iniciarTarefa,
  pausarTarefa
} from "../../servicos/servicoTarefas";
import { normalizarStatusParaColuna } from "../../util/formatacao";

export function PainelDesenvolvedor() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAcao, setCarregandoAcao] = useState(false);
  const [erro, setErro] = useState("");
  const [modal, setModal] = useState({
    aberto: false,
    tipo: null,
    tarefa: null
  });

  const carregarTarefas = useCallback(async () => {
    setErro("");
    try {
      const dados = await buscarTarefasDashboard();
      setTarefas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  const iniciar = async (tarefa) => {
    setCarregandoAcao(true);
    setErro("");
    try {
      await iniciarTarefa(tarefa.id);
      await carregarTarefas();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const abrirModal = (tipo, tarefa) => {
    setModal({ aberto: true, tipo, tarefa });
  };

  const fecharModal = () => {
    setModal({ aberto: false, tipo: null, tarefa: null });
  };

  const confirmarModal = async (detalhesExecucao) => {
    if (!modal.tarefa) {
      return;
    }

    setCarregandoAcao(true);
    setErro("");
    try {
      if (modal.tipo === "pausar") {
        await pausarTarefa(modal.tarefa.id, detalhesExecucao);
      } else {
        await finalizarTarefa(modal.tarefa.id, detalhesExecucao);
      }
      fecharModal();
      await carregarTarefas();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const aoSoltarTarefa = async (tarefaId, statusDestino) => {
    const tarefa = tarefas.find((item) => item.id === tarefaId);
    if (!tarefa) {
      return;
    }

    const statusOrigem = normalizarStatusParaColuna(tarefa.tarefaStatus);
    if (statusOrigem === statusDestino) {
      return;
    }

    if (statusDestino === "DOING" && (tarefa.tarefaStatus === "TODO" || tarefa.tarefaStatus === "PAUSED")) {
      await iniciar(tarefa);
      return;
    }

    if (statusDestino === "TODO" && tarefa.tarefaStatus === "DOING") {
      abrirModal("pausar", tarefa);
      return;
    }

    if (statusDestino === "DONE" && (tarefa.tarefaStatus === "DOING" || tarefa.tarefaStatus === "PAUSED")) {
      abrirModal("finalizar", tarefa);
    }
  };

  const indicadores = useMemo(() => {
    const total = tarefas.length;
    const emExecucao = tarefas.filter((item) => item.tarefaStatus === "DOING").length;
    const concluidas = tarefas.filter((item) => item.tarefaStatus === "DONE").length;
    return { total, emExecucao, concluidas };
  }, [tarefas]);

  return (
    <main className="pagina">
      <CabecalhoAplicacao titulo="Painel do Desenvolvedor" />

      <section className="faixa-indicadores">
        <article className="indicador-card">
          <h4>Total no painel</h4>
          <strong>{indicadores.total}</strong>
        </article>
        <article className="indicador-card">
          <h4>Em execução</h4>
          <strong>{indicadores.emExecucao}</strong>
        </article>
        <article className="indicador-card">
          <h4>Concluídas</h4>
          <strong>{indicadores.concluidas}</strong>
        </article>
      </section>

      {erro && <p className="erro-texto destaque-erro">{erro}</p>}

      {carregando ? (
        <Carregando texto="Buscando tarefas..." />
      ) : (
        <QuadroKanban
          tarefas={tarefas}
          perfil="DESENVOLVEDOR"
          onIniciar={iniciar}
          onPausar={(tarefa) => abrirModal("pausar", tarefa)}
          onFinalizar={(tarefa) => abrirModal("finalizar", tarefa)}
          onEditar={() => {}}
          onExcluir={() => {}}
          onVerHistorico={() => {}}
          onSoltarTarefa={aoSoltarTarefa}
        />
      )}

      <ModalDetalhesExecucao
        aberto={modal.aberto}
        titulo={
          modal.tipo === "pausar"
            ? "Pausar tarefa e registrar observação"
            : "Finalizar tarefa e registrar observação"
        }
        obrigatorio
        carregando={carregandoAcao}
        onCancelar={fecharModal}
        onConfirmar={confirmarModal}
      />
    </main>
  );
}
