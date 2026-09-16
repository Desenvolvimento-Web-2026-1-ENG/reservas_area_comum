import type { Reserva } from "../../entities/Reserva.js";
import type { RepositorioReserva } from "../../repositories/RepositorioReserva.js";
import { prisma } from "./prismaClient.js";

function mapear(r: any): Reserva {
  return {
    id: r.id,
    usuarioId: r.usuarioId,
    espacoId: r.espacoId,
    data: r.data,
    horaInicio: r.horaInicio,
    horaFim: r.horaFim,
    status: r.status,
    ...(r.estadoAnterior ? { estadoAnterior: r.estadoAnterior } : {}),
    criadaEm: r.criadaEm
  };
}

export class PrismaRepositorioReserva implements RepositorioReserva {
  async buscarPorId(id: string): Promise<Reserva | null> {
    const item = await prisma.reserva.findUnique({ where: { id } });
    return item ? mapear(item) : null;
  }

  async listarPorEspaco(espacoId: string): Promise<Reserva[]> {
    const itens = await prisma.reserva.findMany({
      where: { espacoId },
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }]
    });
    return itens.map(mapear);
  }

  async listarTodos(): Promise<Reserva[]> {
    const itens = await prisma.reserva.findMany({
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }]
    });
    return itens.map(mapear);
  }

  async listarPorUsuario(usuarioId: string): Promise<Reserva[]> {
    const itens = await prisma.reserva.findMany({
      where: { usuarioId },
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }]
    });
    return itens.map(mapear);
  }

  async listarPorUsuarioEData(usuarioId: string, data: string): Promise<Reserva[]> {
    const itens = await prisma.reserva.findMany({ where: { usuarioId, data } });
    return itens.map(mapear);
  }

  async salvar(reserva: Reserva): Promise<void> {
    await prisma.reserva.upsert({
      where: { id: reserva.id },
      create: {
        id: reserva.id,
        usuarioId: reserva.usuarioId,
        espacoId: reserva.espacoId,
        data: reserva.data,
        horaInicio: reserva.horaInicio,
        horaFim: reserva.horaFim,
        status: reserva.status,
        estadoAnterior: reserva.estadoAnterior,
        criadaEm: reserva.criadaEm
      },
      update: {
        data: reserva.data,
        horaInicio: reserva.horaInicio,
        horaFim: reserva.horaFim,
        status: reserva.status,
        estadoAnterior: reserva.estadoAnterior
      }
    });
  }

  async remover(id: string): Promise<void> {
    await prisma.reserva.delete({ where: { id } });
  }
}
