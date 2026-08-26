import { FalhaAplicacao } from "./FalhaAplicacao.js";

export class DadosInvalidos extends FalhaAplicacao {
  constructor(mensagem: string) {
    super("VALIDACAO", mensagem);
  }
}
