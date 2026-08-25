import type { Usuario } from "../entities/Usuario.js";

export interface RepositorioUsuario {
  buscarPorId(id: string): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(): Promise<Usuario[]>;
  salvar(usuario: Usuario): Promise<void>;
  remover(id: string): Promise<void>;
}
