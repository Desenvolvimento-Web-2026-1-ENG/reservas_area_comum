export type TipoErro = "VALIDACAO" | "AUTENTICACAO" | "AUTORIZACAO" | "NAO_ENCONTRADO" | "CONFLITO";

export class FalhaAplicacao extends Error {
  constructor(public readonly tipo: TipoErro, message: string) {
    super(message);
    this.name = new.target.name;
  }
}
