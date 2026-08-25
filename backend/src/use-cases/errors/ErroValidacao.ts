import { FalhaAplicacao } from "./ErroAplicacao.js";

export class DadosInvalidos extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("VALIDACAO", mensagem);
  }
}
