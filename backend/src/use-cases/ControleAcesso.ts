import type { RepositorioUsuario } from "../repositories/RepositorioUsuario.js";
import type { Usuario } from "../entities/Usuario.js";
import { RecursoAusente } from "./errors/RecursoAusente.js";
import { AcessoNegado } from "./errors/AcessoNegado.js";

export class ControleAcesso {
  constructor(private readonly usuarios: RepositorioUsuario) {}

  async usuario(id: string): Promise<Usuario> {
    const usuario = await this.usuarios.buscarPorId(id);
    if (!usuario) throw new RecursoAusente("Usuário");
    return usuario;
  }

  async exigirZelador(id: string): Promise<Usuario> {
    const usuario = await this.usuario(id);
    if (usuario.papel !== "ZELADOR") {
      throw new AcessoNegado("Operação exclusiva do zelador");
    }
    return usuario;
  }

  async exigirMorador(id: string): Promise<Usuario> {
    const usuario = await this.usuario(id);
    if (usuario.papel !== "MORADOR") {
      throw new AcessoNegado("Operação exclusiva de morador");
    }
    return usuario;
  }
}
