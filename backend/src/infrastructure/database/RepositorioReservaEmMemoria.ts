import type { Reserva } from "../../entities/Reserva.js";
import type { RepositorioReserva } from "../../repositories/RepositorioReserva.js";
import { RepositorioBaseEmMemoria } from "./RepositorioBaseEmMemoria.js";

export class RepositorioReservaEmMemoria extends RepositorioBaseEmMemoria<Reserva> implements RepositorioReserva {
  async listarTodos(): Promise<Reserva[]> {
    return [...this.itens.values()];
  }

  async listarPorEspaco(espacoId: string): Promise<Reserva[]> {
    return [...this.itens.values()].filter((r) => r.espacoId === espacoId);
  }

  async listarPorUsuario(usuarioId: string): Promise<Reserva[]> {
    return [...this.itens.values()].filter((r) => r.usuarioId === usuarioId);
  }

  async listarPorUsuarioEData(usuarioId: string, data: string): Promise<Reserva[]> {
    return [...this.itens.values()].filter((r) => r.usuarioId === usuarioId && r.data === data);
  }
}
