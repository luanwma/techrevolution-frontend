export function Carregando({ texto = "Carregando..." }) {
  return (
    <div className="carregando">
      <span className="spinner" />
      <span>{texto}</span>
    </div>
  );
}
