import type { Espaco } from "../../entities/Espaco.js";
import type { RepositorioEspaco } from "../../repositories/RepositorioEspaco.js";
import { RepositorioBaseEmMemoria } from "./RepositorioBaseEmMemoria.js";

export class RepositorioEspacoEmMemoria extends RepositorioBaseEmMemoria<Espaco> implements RepositorioEspaco {
  async listarTodos(): Promise<Espaco[]> {
    return [...this.itens.values()];
  }
}
