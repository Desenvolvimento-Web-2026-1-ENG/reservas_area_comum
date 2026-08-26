import type { Controller, HttpRequest } from "./Http.js";
import { resposta, texto } from "./Http.js";
import type { AgendaReservas } from "../../use-cases/AgendaReservas.js";
import type { FiltrosReserva } from "../../use-cases/AgendaReservas.js";

function filtros(query: Record<string, string | string[] | undefined> | undefined): FiltrosReserva {
  const valor = (nome: string) => typeof query?.[nome] === "string" ? query[nome] as string : undefined;
  const numero = (nome: string) => valor(nome) === undefined ? undefined : Number(valor(nome));
  return {
    data: valor("data"),
    dataInicio: valor("dataInicio"),
    dataFim: valor("dataFim"),
    status: valor("status") as FiltrosReserva["status"],
    pagina: numero("pagina"),
    limite: numero("limite")
  };
}

export class CriarReservaController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.criar(r.usuarioId!, {
      espacoId: r.params!.espacoId,
      data: texto(r.body, "data"),
      horaInicio: texto(r.body, "horaInicio"),
      horaFim: texto(r.body, "horaFim")
    });
    return resposta(reserva, 201);
  }
}

export class ListarReservasDoEspacoController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reservas = await this.service.listarPorEspaco(r.params!.espacoId, filtros(r.query));
    return resposta(reservas);
  }
}

export class ListarMinhasReservasController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reservas = await this.service.listarMinhas(r.usuarioId!, filtros(r.query));
    return resposta(reservas);
  }
}

export class ConsultarDisponibilidadeController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const data = typeof r.query?.data === "string" ? r.query.data : "";
    return resposta(await this.service.disponibilidade(r.params!.espacoId, data));
  }
}

export class AprovarReservaController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.aprovar(r.usuarioId!, r.params!.reservaId);
    return resposta(reserva);
  }
}

export class RecusarReservaController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.recusar(r.usuarioId!, r.params!.reservaId);
    return resposta(reserva);
  }
}

export class SolicitarCancelamentoController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.solicitarCancelamento(r.usuarioId!, r.params!.reservaId);
    return resposta(reserva);
  }
}

export class AprovarCancelamentoController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.aprovarCancelamento(r.usuarioId!, r.params!.reservaId);
    return resposta(reserva);
  }
}

export class RecusarCancelamentoController implements Controller {
  constructor(private readonly service: AgendaReservas) {}

  async executar(r: HttpRequest) {
    const reserva = await this.service.recusarCancelamento(r.usuarioId!, r.params!.reservaId);
    return resposta(reserva);
  }
}
