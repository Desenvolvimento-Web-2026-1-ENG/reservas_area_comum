import { FalhaAplicacao } from "./ErroAplicacao.js";

export class OperacaoConflitante extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("CONFLITO", mensagem);
  }
}
