import type { UsuarioDto } from "./UsuarioDto.js";

export interface AutenticarDto {
  email: string;
  senha: string;
}

export interface AutenticacaoDto {
  token: string;
  usuario: UsuarioDto;
}
