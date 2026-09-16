import type { Controller, HttpRequest } from "./Http.js";
import { resposta, texto } from "./Http.js";
import type { GestorUsuarios } from "../../use-cases/GestorUsuarios.js";

export class BuscarMeuUsuarioController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}

  async executar(r: HttpRequest) {
    const usuario = await this.service.buscarPorId(r.usuarioId!);
    return resposta(usuario);
  }
}

export class AtualizarMeuUsuarioController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}

  async executar(r: HttpRequest) {
    const usuario = await this.service.atualizarMeuUsuario(r.usuarioId!, {
      nome: texto(r.body, "nome"),
      email: texto(r.body, "email"),
      senha: texto(r.body, "senha") || undefined
    });
    return resposta(usuario);
  }
}