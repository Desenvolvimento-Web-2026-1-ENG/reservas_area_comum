import type { Controller, HttpRequest } from "./Http.js";
import { resposta, texto } from "./Http.js";
import type { GestorUsuarios } from "../../use-cases/GestorUsuarios.js";
import type { PapelUsuario } from "../../entities/Usuario.js";

export class CadastrarUsuarioController implements Controller {
  constructor(private readonly service: GestorUsuarios) {}

  async executar(r: HttpRequest) {
    const usuario = await this.service.cadastrar({
      nome: texto(r.body, "nome"),
      email: texto(r.body, "email"),
      senha: texto(r.body, "senha"),
      papel: texto(r.body, "papel") as PapelUsuario
    });
    return resposta(usuario, 201);
  }
}
