import type { Controller, HttpRequest } from "./Http.js";
import { resposta } from "./Http.js";
import type { GestorUsuarios } from "../../use-cases/GestorUsuarios.js";

export class BuscarMeuUsuarioController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}

  async executar(r: HttpRequest) {
    const usuario = await this.service.buscarPorId(r.usuarioId!);
    return resposta(usuario);
  }
}