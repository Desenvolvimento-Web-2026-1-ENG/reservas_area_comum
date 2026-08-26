import { FalhaAplicacao } from "./ErroAplicacao.js";

export class SessaoNaoAutorizada extends FalhaAplicacao {
  constructor() {
    super("AUTENTICACAO", "Token ausente ou inválido");
  }
}
