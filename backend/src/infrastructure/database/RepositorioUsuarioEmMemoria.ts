import type { Usuario } from "../../entities/Usuario.js";
import type { RepositorioUsuario } from "../../repositories/RepositorioUsuario.js";
import { RepositorioBaseEmMemoria } from "./RepositorioBaseEmMemoria.js";

export class RepositorioUsuarioEmMemoria extends RepositorioBaseEmMemoria<Usuario> implements RepositorioUsuario {
  async listarTodos(): Promise<Usuario[]> {
    return [...this.itens.values()];
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return [...this.itens.values()].find((usuario) => usuario.email === email) ?? null;
  }
}
