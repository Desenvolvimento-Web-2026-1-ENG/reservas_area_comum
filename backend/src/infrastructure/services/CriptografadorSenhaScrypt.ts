import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { CriptografadorSenha } from "../../use-cases/ports/CriptografadorSenha.js";

const scrypt = promisify(scryptCallback);

export class CriptografadorSenhaScrypt implements CriptografadorSenha {
  async criptografar(senha: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const hash = (await scrypt(senha, salt, 64)) as Buffer;
    return `${salt}:${hash.toString("hex")}`;
  }

  async comparar(senha: string, armazenada: string): Promise<boolean> {
    const [salt, hex] = armazenada.split(":");
    if (!salt || !hex) return false;
    const atual = (await scrypt(senha, salt, 64)) as Buffer;
    const esperado = Buffer.from(hex, "hex");
    return atual.length === esperado.length && timingSafeEqual(atual, esperado);
  }
}
