import type { Controller, HttpRequest } from "./Http.js";
import { resposta } from "./Http.js";
import type { GestorUsuarios } from "../../use-cases/GestorUsuarios.js";
import type { AgendaReservas } from "../../use-cases/AgendaReservas.js";

export class ListarUsuariosController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}
  async executar(r: HttpRequest) {
    return resposta(await this.service.listarTodos(r.usuarioId!));
  }
}

export class ListarReservasPendentesController implements Controller {
  constructor(private readonly service: AgendaReservas) {}
  async executar(r: HttpRequest) {
    return resposta(await this.service.listarPendentes(r.usuarioId!));
  }
}

export class ListarCancelamentosPendentesController implements Controller {
  constructor(private readonly service: AgendaReservas) {}
  async executar(r: HttpRequest) {
    return resposta(await this.service.listarCancelamentosPendentes(r.usuarioId!));
  }
}
