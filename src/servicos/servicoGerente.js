import { Usuario } from "../modelos/usuario";
import { clienteApi } from "./clienteApi";

export async function cadastrarDesenvolvedor(payload) {
  const { data } = await clienteApi.post("/api/gerente/registro/desenvolvedor", payload);
  return Usuario.deApi(data);
}
