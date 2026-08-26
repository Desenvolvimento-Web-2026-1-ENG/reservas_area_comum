export type PapelUsuario = "MORADOR" | "ZELADOR";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaCriptografada: string;
  papel: PapelUsuario;
  criadoEm: Date;
}
