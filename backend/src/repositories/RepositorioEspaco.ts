import type { Espaco } from "../entities/Espaco.js";

export interface RepositorioEspaco {
  buscarPorId(id: string): Promise<Espaco | null>;
  listarTodos(): Promise<Espaco[]>;
  salvar(espaco: Espaco): Promise<void>;
  remover(id: string): Promise<void>;
}
