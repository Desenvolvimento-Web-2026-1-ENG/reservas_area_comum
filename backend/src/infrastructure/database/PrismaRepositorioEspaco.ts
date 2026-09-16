import type { Espaco } from "../../entities/Espaco.js";
import type { RepositorioEspaco } from "../../repositories/RepositorioEspaco.js";
import { prisma } from "./prismaClient.js";

function mapear(e: any): Espaco {
  return {
    id: e.id,
    nome: e.nome,
    descricao: e.descricao,
    capacidade: e.capacidade,
    regras: e.regras,
    criadoEm: e.criadoEm
  };
}

export class PrismaRepositorioEspaco implements RepositorioEspaco {
  async buscarPorId(id: string): Promise<Espaco | null> {
    const item = await prisma.espaco.findUnique({ where: { id } });
    return item ? mapear(item) : null;
  }

  async listarTodos(): Promise<Espaco[]> {
    const itens = await prisma.espaco.findMany({ orderBy: { nome: "asc" } });
    return itens.map(mapear);
  }

  async salvar(espaco: Espaco): Promise<void> {
    await prisma.espaco.upsert({
      where: { id: espaco.id },
      create: espaco,
      update: {
        nome: espaco.nome,
        descricao: espaco.descricao,
        capacidade: espaco.capacidade,
        regras: espaco.regras
      }
    });
  }

  async remover(id: string): Promise<void> {
    await prisma.espaco.delete({ where: { id } });
  }
}
