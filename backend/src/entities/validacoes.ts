import { DadosInvalidos } from "../use-cases/errors/DadosInvalidos.js";

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export function exigirTexto(valor: string, campo: string): string {
  const texto = valor?.trim();
  if (!texto) throw new DadosInvalidos(`O campo ${campo} é obrigatório`);
  return texto;
}

export function exigirInteiroPositivo(valor: number, campo: string): number {
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new DadosInvalidos(`O campo ${campo} deve ser um número inteiro maior que zero`);
  }
  return valor;
}

export function exigirData(valor: string, campo = "data"): string {
  if (!REGEX_DATA.test(valor ?? "")) {
    throw new DadosInvalidos(`O campo ${campo} deve estar no formato AAAA-MM-DD`);
  }
  return valor;
}

export function exigirHora(valor: string, campo: string): string {
  if (!REGEX_HORA.test(valor ?? "")) {
    throw new DadosInvalidos(`O campo ${campo} deve estar no formato HH:mm`);
  }
  return valor;
}

// Combina data + hora em um único Date para permitir comparações cronológicas
export function combinarDataHora(data: string, hora: string): Date {
  return new Date(`${data}T${hora}:00`);
}

// Verifica se dois intervalos [inicioA, fimA) e [inicioB, fimB) se sobrepõem
export function intervalosConflitam(inicioA: Date, fimA: Date, inicioB: Date, fimB: Date): boolean {
  return inicioA < fimB && inicioB < fimA;
}
