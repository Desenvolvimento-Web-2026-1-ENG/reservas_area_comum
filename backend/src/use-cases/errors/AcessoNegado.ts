import { FalhaAplicacao } from "./FalhaAplicacao.js";

export class AcessoNegado extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("AUTORIZACAO", mensagem);
  }
}
