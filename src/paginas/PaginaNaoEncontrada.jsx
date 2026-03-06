import { Link } from "react-router-dom";

export function PaginaNaoEncontrada() {
  return (
    <main className="pagina-404">
      <h1>Página não encontrada</h1>
      <Link className="botao botao-primario" to="/">
        Voltar ao início
      </Link>
    </main>
  );
}
