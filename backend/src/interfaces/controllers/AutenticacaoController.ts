import type { Controller, HttpRequest } from "./Http.js";
import { resposta, texto } from "./Http.js";
import type { GestorUsuarios } from "../../use-cases/GestorUsuarios.js";

export class AutenticacaoController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}

  async executar(r: HttpRequest) {
    const autenticacao = await this.service.autenticar({
      email: texto(r.body, "email"),
      senha: texto(r.body, "senha")
    });
    return resposta(autenticacao);
  }
}
