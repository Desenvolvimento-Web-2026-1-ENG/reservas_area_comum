import type { Reserva } from "../entities/Reserva.js";

export interface RepositorioReserva {
  buscarPorId(id: string): Promise<Reserva | null>;
  listarPorEspaco(espacoId: string): Promise<Reserva[]>;
  listarTodos(): Promise<Reserva[]>;
  listarPorUsuario(usuarioId: string): Promise<Reserva[]>;
  listarPorUsuarioEData(usuarioId: string, data: string): Promise<Reserva[]>;
  salvar(reserva: Reserva): Promise<void>;
  remover(id: string): Promise<void>;
}
