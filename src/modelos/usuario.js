export class Usuario {
  constructor({ id, nome, email, role, gerenteid = null, ativo = true }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.role = role;
    this.gerenteid = gerenteid;
    this.ativo = ativo;
  }

  static deApi(api) {
    return new Usuario({
      id: api.id,
      nome: api.nome,
      email: api.email,
      role: api.role,
      gerenteid: api.gerenteid ?? null,
      ativo: Boolean(api.ativo)
    });
  }

  ehGerente() {
    return this.role === "GERENTE";
  }

  ehDesenvolvedor() {
    return this.role === "DESENVOLVEDOR";
  }
}
