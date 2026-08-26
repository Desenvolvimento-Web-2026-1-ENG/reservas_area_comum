import type { FonteDeTempo } from "../../use-cases/ports/FonteDeTempo.js";

export class TempoDoSistema implements FonteDeTempo {
  agora(): Date {
    return new Date();
  }
}