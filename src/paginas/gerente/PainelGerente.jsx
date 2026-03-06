import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { CabecalhoAplicacao } from "../../componentes/comum/CabecalhoAplicacao";
import { Carregando } from "../../componentes/comum/Carregando";
import { TabelaHistorico } from "../../componentes/comum/TabelaHistorico";
import { QuadroKanban } from "../../componentes/kanban/QuadroKanban";
import { cadastrarDesenvolvedor } from "../../servicos/servicoGerente";
import {
  buscarHistoricoGerente,
  buscarHistoricoPorDesenvolvedor,
  buscarHistoricoPorTarefa
} from "../../servicos/servicoHistorico";
import {
  buscarTarefasDashboard,
  criarTarefa,
  deletarTarefa,
  editarTarefa
} from "../../servicos/servicoTarefas";
import { inputDataParaIso, isoParaInputData } from "../../util/formatacao";
import { agruparProdutividadePorExecutor, totalSegundos } from "../../util/produtividade";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const formularioInicial = {
  titulo: "",
  descricao: "",
  tarefaStatus: "TODO",
  prazoFinal: "",
  prioridade: "NORMAL",
  categoriaNome: "",
  categoriaHexadecimal: "#1f8f66",
  etiquetasTexto: ""
};

const formularioDesenvolvedorInicial = {
  nome: "",
  email: "",
  senha: ""
};

const paletaGraficos = ["#1f8f66", "#ff9f1c", "#2e86ab", "#e76f51", "#3d5a80", "#588157"];

export function PainelGerente() {
  const [tarefas, setTarefas] = useState([]);
  const [carregandoTarefas, setCarregandoTarefas] = useState(true);
  const [carregandoAcao, setCarregandoAcao] = useState(false);
  const [erro, setErro] = useState("");

  const [historicoGeral, setHistoricoGeral] = useState([]);
  const [historicoEmExibicao, setHistoricoEmExibicao] = useState([]);
  const [executorSelecionado, setExecutorSelecionado] = useState("GERAL");
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);

  const [formulario, setFormulario] = useState(formularioInicial);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [formularioDev, setFormularioDev] = useState(formularioDesenvolvedorInicial);

  const [modalHistorico, setModalHistorico] = useState({
    aberto: false,
    titulo: "",
    itens: []
  });

  const carregarTarefas = useCallback(async () => {
    try {
      const dados = await buscarTarefasDashboard();
      setTarefas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoTarefas(false);
    }
  }, []);

  const carregarHistoricoGerente = useCallback(async () => {
    try {
      const historico = await buscarHistoricoGerente();
      setHistoricoGeral(historico);
      setHistoricoEmExibicao(historico);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoHistorico(false);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
    carregarHistoricoGerente();
  }, [carregarHistoricoGerente, carregarTarefas]);

  const atualizarCampoFormulario = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const atualizarCampoDesenvolvedor = (campo, valor) => {
    setFormularioDev((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const converterFormularioParaPayload = (dados) => ({
    titulo: dados.titulo,
    descricao: dados.descricao,
    tarefaStatus: dados.tarefaStatus,
    prazoFinal: inputDataParaIso(dados.prazoFinal),
    prioridade: dados.prioridade,
    categoria: {
      nome: dados.categoriaNome,
      hexadecimal: dados.categoriaHexadecimal
    },
    etiquetas: dados.etiquetasTexto
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  });

  const limparFormularioTarefa = () => {
    setFormulario(formularioInicial);
    setTarefaEmEdicao(null);
  };

  const submeterTarefa = async (evento) => {
    evento.preventDefault();
    setErro("");
    setCarregandoAcao(true);

    try {
      const payload = converterFormularioParaPayload(formulario);
      if (tarefaEmEdicao) {
        await editarTarefa(tarefaEmEdicao, payload);
      } else {
        await criarTarefa(payload);
      }
      limparFormularioTarefa();
      await carregarTarefas();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const selecionarTarefaParaEdicao = (tarefa) => {
    setTarefaEmEdicao(tarefa.id);
    setFormulario({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      tarefaStatus: tarefa.tarefaStatus === "PAUSED" ? "TODO" : tarefa.tarefaStatus,
      prazoFinal: isoParaInputData(tarefa.prazoFinal),
      prioridade: tarefa.prioridade,
      categoriaNome: tarefa.categoria?.nome || "",
      categoriaHexadecimal: tarefa.categoria?.hexadecimal || "#1f8f66",
      etiquetasTexto: (tarefa.etiquetas || []).map((etiqueta) => etiqueta.descricao).join(", ")
    });
  };

  const excluir = async (tarefa) => {
    const confirmou = window.confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`);
    if (!confirmou) {
      return;
    }
    setErro("");
    setCarregandoAcao(true);
    try {
      await deletarTarefa(tarefa.id);
      await carregarTarefas();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const soltarTarefaGerente = async (tarefaId, statusDestino) => {
    const tarefa = tarefas.find((item) => item.id === tarefaId);
    if (!tarefa || tarefa.tarefaStatus === statusDestino) {
      return;
    }

    const payload = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      tarefaStatus: statusDestino,
      prazoFinal: tarefa.prazoFinal,
      prioridade: tarefa.prioridade,
      categoria: {
        nome: tarefa.categoria?.nome || "",
        hexadecimal: tarefa.categoria?.hexadecimal || "#1f8f66"
      },
      etiquetas: (tarefa.etiquetas || []).map((etiqueta) => etiqueta.descricao)
    };

    setErro("");
    setCarregandoAcao(true);
    try {
      await editarTarefa(tarefaId, payload);
      await carregarTarefas();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const cadastrarDev = async (evento) => {
    evento.preventDefault();
    setErro("");
    setCarregandoAcao(true);
    try {
      await cadastrarDesenvolvedor(formularioDev);
      setFormularioDev(formularioDesenvolvedorInicial);
      await carregarHistoricoGerente();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const abrirHistoricoTarefa = async (tarefa) => {
    setErro("");
    setCarregandoAcao(true);
    try {
      const itens = await buscarHistoricoPorTarefa(tarefa.id);
      setModalHistorico({
        aberto: true,
        titulo: `Histórico da tarefa: ${tarefa.titulo}`,
        itens
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoAcao(false);
    }
  };

  const fecharModalHistorico = () => {
    setModalHistorico({ aberto: false, titulo: "", itens: [] });
  };

  const alterarFiltroExecutor = async (executorId) => {
    setExecutorSelecionado(executorId);
    setErro("");
    setCarregandoHistorico(true);
    try {
      if (executorId === "GERAL") {
        setHistoricoEmExibicao(historicoGeral);
      } else {
        const dados = await buscarHistoricoPorDesenvolvedor(executorId);
        setHistoricoEmExibicao(dados);
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  const dadosProdutividade = useMemo(
    () => agruparProdutividadePorExecutor(historicoGeral),
    [historicoGeral]
  );

  const totalHoras = useMemo(() => totalSegundos(historicoGeral) / 3600, [historicoGeral]);

  const dadosGraficoQuantidade = useMemo(
    () => ({
      labels: dadosProdutividade.map((item) => item.nomeExecutor),
      datasets: [
        {
          label: "Tarefas realizadas",
          data: dadosProdutividade.map((item) => item.quantidadeTarefas),
          backgroundColor: "#2e86ab"
        }
      ]
    }),
    [dadosProdutividade]
  );

  const dadosGraficoTempo = useMemo(
    () => ({
      labels: dadosProdutividade.map((item) => item.nomeExecutor),
      datasets: [
        {
          label: "Tempo de produção (horas)",
          data: dadosProdutividade.map((item) => Number((item.tempoSegundos / 3600).toFixed(2))),
          backgroundColor: dadosProdutividade.map(
            (_, indice) => paletaGraficos[indice % paletaGraficos.length]
          ),
          borderWidth: 0
        }
      ]
    }),
    [dadosProdutividade]
  );

  return (
    <main className="pagina">
      <CabecalhoAplicacao titulo="Painel do Gerente" />

      {erro && <p className="erro-texto destaque-erro">{erro}</p>}

      <section className="grade-gerente">
        <article className="bloco">
          <h2>{tarefaEmEdicao ? "Editar tarefa" : "Cadastrar tarefa"}</h2>
          <form className="formulario grade-formulario" onSubmit={submeterTarefa}>
            <label className="campo">
              Título
              <input
                value={formulario.titulo}
                onChange={(evento) => atualizarCampoFormulario("titulo", evento.target.value)}
                required
              />
            </label>
            <label className="campo">
              Prazo final
              <input
                type="datetime-local"
                value={formulario.prazoFinal}
                onChange={(evento) => atualizarCampoFormulario("prazoFinal", evento.target.value)}
                required
              />
            </label>
            <label className="campo campo-largo">
              Descrição
              <textarea
                rows={4}
                value={formulario.descricao}
                onChange={(evento) => atualizarCampoFormulario("descricao", evento.target.value)}
                required
              />
            </label>
            <label className="campo">
              Status
              <select
                value={formulario.tarefaStatus}
                onChange={(evento) => atualizarCampoFormulario("tarefaStatus", evento.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="DOING">DOING</option>
                <option value="DONE">DONE</option>
              </select>
            </label>
            <label className="campo">
              Prioridade
              <select
                value={formulario.prioridade}
                onChange={(evento) => atualizarCampoFormulario("prioridade", evento.target.value)}
              >
                <option value="BAIXA">BAIXA</option>
                <option value="NORMAL">NORMAL</option>
                <option value="ALTA">ALTA</option>
                <option value="URGENTE">URGENTE</option>
              </select>
            </label>
            <label className="campo">
              Categoria
              <input
                value={formulario.categoriaNome}
                onChange={(evento) => atualizarCampoFormulario("categoriaNome", evento.target.value)}
                placeholder="Ex.: Backend"
                required
              />
            </label>
            <label className="campo">
              Cor da categoria
              <input
                type="color"
                value={formulario.categoriaHexadecimal}
                onChange={(evento) =>
                  atualizarCampoFormulario("categoriaHexadecimal", evento.target.value)
                }
              />
            </label>
            <label className="campo campo-largo">
              Etiquetas (separe por vírgula)
              <input
                value={formulario.etiquetasTexto}
                onChange={(evento) => atualizarCampoFormulario("etiquetasTexto", evento.target.value)}
                placeholder="api, urgente, sprint-12"
              />
            </label>
            <div className="linha-acoes-formulario">
              <button className="botao botao-primario" type="submit" disabled={carregandoAcao}>
                {carregandoAcao ? "Salvando..." : tarefaEmEdicao ? "Atualizar tarefa" : "Criar tarefa"}
              </button>
              {tarefaEmEdicao && (
                <button className="botao botao-secundario" type="button" onClick={limparFormularioTarefa}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="bloco">
          <h2>Cadastrar desenvolvedor</h2>
          <form className="formulario" onSubmit={cadastrarDev}>
            <label className="campo">
              Nome
              <input
                value={formularioDev.nome}
                onChange={(evento) => atualizarCampoDesenvolvedor("nome", evento.target.value)}
                required
              />
            </label>
            <label className="campo">
              E-mail
              <input
                type="email"
                value={formularioDev.email}
                onChange={(evento) => atualizarCampoDesenvolvedor("email", evento.target.value)}
                required
              />
            </label>
            <label className="campo">
              Senha
              <input
                type="password"
                value={formularioDev.senha}
                onChange={(evento) => atualizarCampoDesenvolvedor("senha", evento.target.value)}
                minLength={6}
                required
              />
            </label>
            <button className="botao botao-primario" type="submit" disabled={carregandoAcao}>
              Criar desenvolvedor
            </button>
          </form>
        </article>
      </section>

      {carregandoTarefas ? (
        <Carregando texto="Buscando tarefas ativas..." />
      ) : (
        <section className="bloco">
          <h2>Kanban de tarefas</h2>
          <p className="subtexto">
            Arraste os cards entre TODO, DOING e DONE para atualizar o status.
          </p>
          <QuadroKanban
            tarefas={tarefas}
            perfil="GERENTE"
            onIniciar={() => {}}
            onPausar={() => {}}
            onFinalizar={() => {}}
            onEditar={selecionarTarefaParaEdicao}
            onExcluir={excluir}
            onVerHistorico={abrirHistoricoTarefa}
            onSoltarTarefa={soltarTarefaGerente}
          />
        </section>
      )}

      <section className="bloco">
        <h2>Produtividade da equipe</h2>
        <div className="faixa-indicadores">
          <article className="indicador-card">
            <h4>Históricos registrados</h4>
            <strong>{historicoGeral.length}</strong>
          </article>
          <article className="indicador-card">
            <h4>Horas totais de produção</h4>
            <strong>{totalHoras.toFixed(1)}h</strong>
          </article>
          <article className="indicador-card">
            <h4>Desenvolvedores com produção</h4>
            <strong>{dadosProdutividade.length}</strong>
          </article>
        </div>

        <div className="grade-graficos">
          <article className="grafico-card">
            <h3>Tarefas por desenvolvedor</h3>
            <Bar data={dadosGraficoQuantidade} options={{ responsive: true, maintainAspectRatio: false }} />
          </article>
          <article className="grafico-card">
            <h3>Tempo de produção por desenvolvedor</h3>
            <Doughnut data={dadosGraficoTempo} options={{ responsive: true, maintainAspectRatio: false }} />
          </article>
        </div>

        <div className="grade-cards-dev">
          {dadosProdutividade.map((item) => (
            <article key={item.executorId} className="card-dev">
              <h4>{item.nomeExecutor}</h4>
              <p>{item.quantidadeTarefas} tarefas concluídas</p>
              <strong>{(item.tempoSegundos / 3600).toFixed(2)} horas</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="bloco">
        <div className="cabecalho-bloco">
          <h2>Histórico de tarefas</h2>
          <label className="campo campo-filtro">
            Filtrar por desenvolvedor
            <select
              value={executorSelecionado}
              onChange={(evento) => alterarFiltroExecutor(evento.target.value)}
            >
              <option value="GERAL">Todos</option>
              {dadosProdutividade.map((item) => (
                <option key={item.executorId} value={item.executorId}>
                  {item.nomeExecutor}
                </option>
              ))}
            </select>
          </label>
        </div>

        {carregandoHistorico ? (
          <Carregando texto="Carregando histórico..." />
        ) : (
          <TabelaHistorico historicos={historicoEmExibicao} />
        )}
      </section>

      {modalHistorico.aberto && (
        <div className="modal-fundo">
          <div className="modal-conteudo modal-grande">
            <h3>{modalHistorico.titulo}</h3>
            <TabelaHistorico historicos={modalHistorico.itens} vazioTexto="Sem registros dessa tarefa." />
            <div className="modal-acoes">
              <button className="botao botao-primario" onClick={fecharModalHistorico}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
