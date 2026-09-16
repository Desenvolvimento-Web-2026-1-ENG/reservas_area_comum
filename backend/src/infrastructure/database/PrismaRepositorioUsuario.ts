import type { Usuario } from "../../entities/Usuario.js";
import type { RepositorioUsuario } from "../../repositories/RepositorioUsuario.js";
import { prisma } from "./prismaClient.js";

function mapear(u: any): Usuario {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    senhaCriptografada: u.senhaCriptografada,
    papel: u.papel,
    criadoEm: u.criadoEm
  };
}

export class PrismaRepositorioUsuario implements RepositorioUsuario {
  async buscarPorId(id: string): Promise<Usuario | null> {
    const item = await prisma.usuario.findUnique({ where: { id } });
    return item ? mapear(item) : null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const item = await prisma.usuario.findUnique({ where: { email } });
    return item ? mapear(item) : null;
  }

  async listarTodos(): Promise<Usuario[]> {
    const itens = await prisma.usuario.findMany({ orderBy: { criadoEm: "desc" } });
    return itens.map(mapear);
  }

  async salvar(usuario: Usuario): Promise<void> {
    await prisma.usuario.upsert({
      where: { id: usuario.id },
      create: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senhaCriptografada: usuario.senhaCriptografada,
        papel: usuario.papel,
        criadoEm: usuario.criadoEm
      },
      update: {
        nome: usuario.nome,
        email: usuario.email,
        senhaCriptografada: usuario.senhaCriptografada,
        papel: usuario.papel
      }
    });
  }

  async remover(id: string): Promise<void> {
    await prisma.usuario.delete({ where: { id } });
  }
}
