import { FalhaAplicacao } from "./ErroAplicacao.js";

export class AcessoNegado extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("AUTORIZACAO", mensagem);
  }
}
