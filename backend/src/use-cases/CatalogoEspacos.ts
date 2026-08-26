import type { RepositorioEspaco } from "../repositories/RepositorioEspaco.js";
import type { GeradorIdentificador } from "./ports/GeradorIdentificador.js";
import type { FonteDeTempo } from "./ports/FonteDeTempo.js";
import type { ControleAcesso } from "./ControleAcesso.js";
import type { CadastrarEspacoDto, AtualizarEspacoDto } from "./dtos/EspacoDto.js";
import type { Espaco } from "../entities/Espaco.js";
import { exigirTexto, exigirInteiroPositivo } from "../entities/validacoes.js";
import { RecursoAusente } from "./errors/RecursoAusente.js";
import { DadosInvalidos } from "./errors/DadosInvalidos.js";

interface Dependencias {
  espacos: RepositorioEspaco;
  autorizacao: ControleAcesso;
  ids: GeradorIdentificador;
  tempo: FonteDeTempo;
}

export class CatalogoEspacos {
  constructor(private readonly dependencias: Dependencias) {}

  async cadastrar(zeladorId: string, dto: CadastrarEspacoDto): Promise<Espaco> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);

    const espaco: Espaco = {
      id: this.dependencias.ids.gerar(),
      nome: exigirTexto(dto.nome, "nome"),
      descricao: exigirTexto(dto.descricao, "descricao"),
      capacidade: exigirInteiroPositivo(dto.capacidade, "capacidade"),
      regras: dto.regras?.trim() ?? "",
      criadoEm: this.dependencias.tempo.agora()
    };

    await this.dependencias.espacos.salvar(espaco);
    return espaco;
  }

  async atualizar(zeladorId: string, espacoId: string, dto: AtualizarEspacoDto): Promise<Espaco> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    const espaco = await this.buscarOuFalhar(espacoId);

    if (Object.keys(dto).length === 0) throw new DadosInvalidos("Informe ao menos um campo para atualizar");

    const atualizado: Espaco = {
      ...espaco,
      nome: dto.nome !== undefined ? exigirTexto(dto.nome, "nome") : espaco.nome,
      descricao: dto.descricao !== undefined ? exigirTexto(dto.descricao, "descricao") : espaco.descricao,
      capacidade: dto.capacidade !== undefined ? exigirInteiroPositivo(dto.capacidade, "capacidade") : espaco.capacidade,
      regras: dto.regras !== undefined ? dto.regras.trim() : espaco.regras
    };

    await this.dependencias.espacos.salvar(atualizado);
    return atualizado;
  }

  async remover(zeladorId: string, espacoId: string): Promise<void> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    await this.buscarOuFalhar(espacoId);
    await this.dependencias.espacos.remover(espacoId);
  }

  async listarTodos(): Promise<Espaco[]> {
    return this.dependencias.espacos.listarTodos();
  }

  async buscarOuFalhar(espacoId: string): Promise<Espaco> {
    const espaco = await this.dependencias.espacos.buscarPorId(espacoId);
    if (!espaco) throw new RecursoAusente("Espaço");
    return espaco;
  }
}
