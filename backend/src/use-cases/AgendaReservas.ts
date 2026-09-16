import type { RepositorioReserva } from "../repositories/RepositorioReserva.js";
import type { GeradorIdentificador } from "./ports/GeradorIdentificador.js";
import type { FonteDeTempo } from "./ports/FonteDeTempo.js";
import type { ControleAcesso } from "./ControleAcesso.js";
import type { CatalogoEspacos } from "./CatalogoEspacos.js";
import type { CriarReservaDto } from "./dtos/CriarReservaDto.js";
import type { Reserva } from "../entities/Reserva.js";
import { exigirData, exigirHora, combinarDataHora, intervalosConflitam } from "../entities/validacoes.js";
import { OperacaoConflitante } from "./errors/OperacaoConflitante.js";
import { RecursoAusente } from "./errors/RecursoAusente.js";
import { AcessoNegado } from "./errors/AcessoNegado.js";
import { DadosInvalidos } from "./errors/DadosInvalidos.js";

export interface FiltrosReserva {
  data?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: Reserva["status"];
  pagina?: number;
  limite?: number;
}

export interface ListagemReservas {
  itens: Reserva[];
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

const ANTECEDENCIA_MINIMA_MS = 3 * 60 * 60 * 1000; // 3 horas
const STATUS_ATIVOS = ["PENDENTE", "APROVADA"] as const;

interface Dependencias {
  reservas: RepositorioReserva;
  autorizacao: ControleAcesso;
  espacos: CatalogoEspacos;
  ids: GeradorIdentificador;
  tempo: FonteDeTempo;
}

export class AgendaReservas {
  constructor(private readonly dependencias: Dependencias) {}

  async criar(usuarioId: string, dto: CriarReservaDto): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirMorador(usuarioId);
    await this.dependencias.espacos.buscarOuFalhar(dto.espacoId);

    const data = exigirData(dto.data);
    const horaInicio = exigirHora(dto.horaInicio, "horaInicio");
    const horaFim = exigirHora(dto.horaFim, "horaFim");

    const inicio = combinarDataHora(data, horaInicio);
    const fim = combinarDataHora(data, horaFim);
    if (fim <= inicio) throw new DadosInvalidos("horaFim deve ser posterior a horaInicio");

    const agora = this.dependencias.tempo.agora();
    if (inicio.getTime() - agora.getTime() < ANTECEDENCIA_MINIMA_MS) {
      throw new DadosInvalidos("A reserva deve ser feita com no mínimo 3 horas de antecedência");
    }

    const reservasDoDia = await this.dependencias.reservas.listarPorUsuarioEData(usuarioId, data);
    const jaTemReservaAtivaNoDia = reservasDoDia.some((r) => this.ativa(r));
    if (jaTemReservaAtivaNoDia) {
      throw new OperacaoConflitante("Você já possui uma reserva ativa nesta data (regra de convivência)");
    }

    const reservasDoEspaco = await this.dependencias.reservas.listarPorEspaco(dto.espacoId);
    const temConflito = reservasDoEspaco
      .filter((r) => r.data === data && this.ativa(r))
      .some((r) => intervalosConflitam(inicio, fim, combinarDataHora(r.data, r.horaInicio), combinarDataHora(r.data, r.horaFim)));
    if (temConflito) {
      throw new OperacaoConflitante("Já existe uma reserva para este espaço neste horário");
    }

    const reserva: Reserva = {
      id: this.dependencias.ids.gerar(),
      usuarioId,
      espacoId: dto.espacoId,
      data,
      horaInicio,
      horaFim,
      status: "PENDENTE",
      criadaEm: agora
    };

    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async aprovar(zeladorId: string, reservaId: string): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    const reserva = await this.buscarOuFalhar(reservaId);
    if (reserva.status !== "PENDENTE") {
      throw new OperacaoConflitante("Somente reservas pendentes podem ser aprovadas");
    }
    reserva.status = "APROVADA";
    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async recusar(zeladorId: string, reservaId: string): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    const reserva = await this.buscarOuFalhar(reservaId);
    if (reserva.status !== "PENDENTE") {
      throw new OperacaoConflitante("Somente reservas pendentes podem ser recusadas");
    }
    reserva.status = "RECUSADA";
    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async solicitarCancelamento(usuarioId: string, reservaId: string): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirMorador(usuarioId);
    const reserva = await this.buscarOuFalhar(reservaId);
    if (reserva.usuarioId !== usuarioId) {
      throw new AcessoNegado("Você só pode cancelar as suas próprias reservas");
    }
    if (!this.ativa(reserva)) {
      throw new OperacaoConflitante("Somente reservas pendentes ou aprovadas podem ter cancelamento solicitado");
    }
    reserva.estadoAnterior = reserva.status;
    reserva.status = "CANCELAMENTO_SOLICITADO";
    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async aprovarCancelamento(zeladorId: string, reservaId: string): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    const reserva = await this.buscarOuFalhar(reservaId);
    if (reserva.status !== "CANCELAMENTO_SOLICITADO") {
      throw new OperacaoConflitante("Não há cancelamento pendente de aprovação para esta reserva");
    }
    reserva.status = "CANCELADA";
    reserva.estadoAnterior = undefined;
    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async recusarCancelamento(zeladorId: string, reservaId: string): Promise<Reserva> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    const reserva = await this.buscarOuFalhar(reservaId);
    if (reserva.status !== "CANCELAMENTO_SOLICITADO") {
      throw new OperacaoConflitante("Não há cancelamento pendente de aprovação para esta reserva");
    }
    reserva.status = reserva.estadoAnterior ?? "APROVADA";
    reserva.estadoAnterior = undefined;
    await this.dependencias.reservas.salvar(reserva);
    return reserva;
  }

  async listarPorEspaco(espacoId: string, filtros: FiltrosReserva = {}): Promise<ListagemReservas> {
    await this.dependencias.espacos.buscarOuFalhar(espacoId);
    return this.paginar(await this.dependencias.reservas.listarPorEspaco(espacoId), filtros);
  }

  async listarMinhas(usuarioId: string, filtros: FiltrosReserva = {}): Promise<ListagemReservas> {
    return this.paginar(await this.dependencias.reservas.listarPorUsuario(usuarioId), filtros);
  }

  async listarCancelamentosPendentes(zeladorId: string): Promise<Reserva[]> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    return (await this.dependencias.reservas.listarTodos()).filter(
      (reserva) => reserva.status === "CANCELAMENTO_SOLICITADO"
    );
  }

  async listarPendentes(zeladorId: string): Promise<Reserva[]> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    return (await this.dependencias.reservas.listarTodos()).filter((reserva) => reserva.status === "PENDENTE");
  }

  async disponibilidade(espacoId: string, data: string): Promise<{ espacoId: string; data: string; reservas: Reserva[] }> {
    exigirData(data);
    const reservas = await this.dependencias.espacos.buscarOuFalhar(espacoId).then(() => this.dependencias.reservas.listarPorEspaco(espacoId));
    return {
      espacoId,
      data,
      reservas: reservas.filter((reserva) => reserva.data === data && this.ativa(reserva))
    };
  }

  private paginar(reservas: Reserva[], filtros: FiltrosReserva): ListagemReservas {
    if (filtros.data) exigirData(filtros.data);
    if (filtros.dataInicio) exigirData(filtros.dataInicio, "dataInicio");
    if (filtros.dataFim) exigirData(filtros.dataFim, "dataFim");
    if (filtros.dataInicio && filtros.dataFim && filtros.dataInicio > filtros.dataFim) {
      throw new DadosInvalidos("dataInicio deve ser anterior ou igual a dataFim");
    }
    if (filtros.status && !["PENDENTE", "APROVADA", "RECUSADA", "CANCELAMENTO_SOLICITADO", "CANCELADA"].includes(filtros.status)) {
      throw new DadosInvalidos("status de reserva inválido");
    }

    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 20;
    if (!Number.isInteger(pagina) || pagina < 1) throw new DadosInvalidos("pagina deve ser um inteiro maior que zero");
    if (!Number.isInteger(limite) || limite < 1 || limite > 100) throw new DadosInvalidos("limite deve ser um inteiro entre 1 e 100");

    const filtradas = reservas.filter((reserva) =>
      (!filtros.data || reserva.data === filtros.data) &&
      (!filtros.dataInicio || reserva.data >= filtros.dataInicio) &&
      (!filtros.dataFim || reserva.data <= filtros.dataFim) &&
      (!filtros.status || reserva.status === filtros.status)
    );
    const inicio = (pagina - 1) * limite;
    return {
      itens: filtradas.slice(inicio, inicio + limite),
      pagina,
      limite,
      total: filtradas.length,
      totalPaginas: Math.ceil(filtradas.length / limite)
    };
  }

  private ativa(reserva: Reserva): boolean {
    return (STATUS_ATIVOS as readonly string[]).includes(reserva.status);
  }

  private async buscarOuFalhar(reservaId: string): Promise<Reserva> {
    const reserva = await this.dependencias.reservas.buscarPorId(reservaId);
    if (!reserva) throw new RecursoAusente("Reserva");
    return reserva;
  }
}
