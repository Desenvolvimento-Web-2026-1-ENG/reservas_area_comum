import { FalhaAplicacao } from "./FalhaAplicacao.js";

export class OperacaoConflitante extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("CONFLITO", mensagem);
  }
}
