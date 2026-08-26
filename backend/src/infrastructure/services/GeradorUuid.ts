import { randomUUID } from "node:crypto";
import type { GeradorIdentificador } from "../../use-cases/ports/GeradorIdentificador.js";

export class GeradorUuid implements GeradorIdentificador {
  gerar(): string {
    return randomUUID();
  }
}
