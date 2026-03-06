import dayjs from "dayjs";

export function formatarDataHora(iso) {
  if (!iso) {
    return "-";
  }
  return dayjs(iso).format("DD/MM/YYYY HH:mm");
}

export function formatarSegundos(totalSegundos) {
  const total = Number(totalSegundos || 0);
  const horas = String(Math.floor(total / 3600)).padStart(2, "0");
  const minutos = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const segundos = String(total % 60).padStart(2, "0");
  return `${horas}:${minutos}:${segundos}`;
}

export function isoParaInputData(iso) {
  if (!iso) {
    return "";
  }
  return dayjs(iso).format("YYYY-MM-DDTHH:mm");
}

export function inputDataParaIso(valor) {
  if (!valor) {
    return null;
  }
  return dayjs(valor).toISOString();
}

export function normalizarStatusParaColuna(status) {
  if (status === "PAUSED") {
    return "TODO";
  }
  return status;
}
