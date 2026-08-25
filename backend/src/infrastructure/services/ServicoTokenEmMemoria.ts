import { randomBytes } from "node:crypto";
import type { ServicoToken } from "../../use-cases/ports/ServicoToken.js";

export class ServicoTokenEmMemoria implements ServicoToken {
  private readonly tokens = new Map<string, string>();

  gerar(usuarioId: string): string {
    const token = randomBytes(32).toString("hex");
    this.tokens.set(token, usuarioId);
    return token;
  }

  verificar(token: string): string | null {
    return this.tokens.get(token) ?? null;
  }

  revogarTodos(usuarioId: string): void {
    for (const [token, donoId] of this.tokens) {
      if (donoId === usuarioId) this.tokens.delete(token);
    }
  }
}
