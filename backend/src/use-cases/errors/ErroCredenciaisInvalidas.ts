import { FalhaAplicacao } from "./ErroAplicacao.js";

export class CredenciaisRejeitadas extends FalhaAplicacao {
  constructor() {
    super("AUTENTICACAO", "Email ou senha inválidos");
  }
}
