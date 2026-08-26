import type { NextFunction, Request, Response } from "express";
import { FalhaAplicacao } from "../../use-cases/errors/FalhaAplicacao.js";

const STATUS_POR_TIPO: Record<string, number> = {
  VALIDACAO: 400,
  AUTENTICACAO: 401,
  AUTORIZACAO: 403,
  NAO_ENCONTRADO: 404,
  CONFLITO: 409
};

export function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (erro instanceof FalhaAplicacao) {
    res.status(STATUS_POR_TIPO[erro.tipo]).json({ erro: erro.name, mensagem: erro.message });
    return;
  }
  if (erro instanceof SyntaxError && "status" in erro) {
    res.status(400).json({ erro: "DadosInvalidos", mensagem: "JSON inválido" });
    return;
  }
  console.error(erro);
  res.status(500).json({ erro: "ErroInterno", mensagem: "Erro interno do servidor" });
}
