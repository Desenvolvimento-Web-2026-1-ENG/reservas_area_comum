import type { PapelUsuario } from "../../entities/Usuario.js";

export interface CadastrarUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  papel: PapelUsuario;
}

export interface UsuarioDto {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  criadoEm: Date;
}
