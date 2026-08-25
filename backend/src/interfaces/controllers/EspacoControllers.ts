import type { Controller, HttpRequest } from "./Http.js";
import { resposta, texto, numero } from "./Http.js";
import type { CatalogoEspacos } from "../../use-cases/CatalogoEspacos.js";

export class CadastrarEspacoController implements Controller {
  constructor(private readonly service: CatalogoEspacos) {}

  async executar(r: HttpRequest) {
    const espaco = await this.service.cadastrar(r.usuarioId!, {
      nome: texto(r.body, "nome"),
      descricao: texto(r.body, "descricao"),
      capacidade: numero(r.body, "capacidade"),
      regras: texto(r.body, "regras")
    });
    return resposta(espaco, 201);
  }
}

export class AtualizarEspacoController implements Controller {
  constructor(private readonly service: CatalogoEspacos) {}

  async executar(r: HttpRequest) {
    const dto: Record<string, unknown> = {};
    if (r.body?.nome !== undefined) dto.nome = texto(r.body, "nome");
    if (r.body?.descricao !== undefined) dto.descricao = texto(r.body, "descricao");
    if (r.body?.capacidade !== undefined) dto.capacidade = numero(r.body, "capacidade");
    if (r.body?.regras !== undefined) dto.regras = texto(r.body, "regras");

    const espaco = await this.service.atualizar(r.usuarioId!, r.params!.espacoId, dto);
    return resposta(espaco);
  }
}

export class RemoverEspacoController implements Controller {
  constructor(private readonly service: CatalogoEspacos) {}

  async executar(r: HttpRequest) {
    await this.service.remover(r.usuarioId!, r.params!.espacoId);
    return resposta(undefined, 204);
  }
}

export class ListarEspacosController implements Controller {
  constructor(private readonly service: CatalogoEspacos) {}

  async executar(_r: HttpRequest) {
    const espacos = await this.service.listarTodos();
    return resposta(espacos);
  }
}

export class BuscarEspacoController implements Controller {
  constructor(private readonly service: CatalogoEspacos) {}

  async executar(r: HttpRequest) {
    const espaco = await this.service.buscarOuFalhar(r.params!.espacoId);
    return resposta(espaco);
  }
}
