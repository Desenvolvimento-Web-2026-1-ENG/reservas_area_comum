import { FalhaAplicacao } from "./ErroAplicacao.js";

export class RecursoAusente extends FalhaAplicacao {
  constructor(recurso: string) {
    super("NAO_ENCONTRADO", `${recurso} não encontrado(a)`);
  }
}
