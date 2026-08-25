import { FalhaAplicacao } from "./FalhaAplicacao.js";

export class SessaoNaoAutorizada extends FalhaAplicacao {
  constructor() {
    super("AUTENTICACAO", "Token ausente ou inválido");
  }
}
