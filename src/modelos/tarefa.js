export class Tarefa {
  constructor({
    id,
    titulo,
    descricao,
    tarefaStatus,
    prazoFinal,
    prioridade,
    categoria,
    etiquetas = []
  }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.tarefaStatus = tarefaStatus;
    this.prazoFinal = prazoFinal;
    this.prioridade = prioridade;
    this.categoria = categoria;
    this.etiquetas = etiquetas;
  }

  static deApi(api) {
    return new Tarefa({
      id: api.id,
      titulo: api.titulo,
      descricao: api.descricao,
      tarefaStatus: api.tarefaStatus,
      prazoFinal: api.prazoFinal,
      prioridade: api.prioridade,
      categoria: api.categoria
        ? {
            id: api.categoria.id ?? null,
            nome: api.categoria.nome,
            hexadecimal: api.categoria.hexadecimal
          }
        : null,
      etiquetas: Array.isArray(api.etiquetas)
        ? api.etiquetas.map((etiqueta) => ({
            id: etiqueta.id ?? null,
            descricao: etiqueta.descricao
          }))
        : []
    });
  }

  paraPayload() {
    return {
      titulo: this.titulo,
      descricao: this.descricao,
      tarefaStatus: this.tarefaStatus,
      prazoFinal: this.prazoFinal,
      prioridade: this.prioridade,
      categoria: {
        nome: this.categoria?.nome || "",
        hexadecimal: this.categoria?.hexadecimal || "#1d4ed8"
      },
      etiquetas: (this.etiquetas || []).map((item) =>
        typeof item === "string" ? item : item.descricao
      )
    };
  }
}
