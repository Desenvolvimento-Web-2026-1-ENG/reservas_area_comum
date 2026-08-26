import type { NextFunction, Request, Response } from "express";
import type { ServicoToken } from "../../use-cases/ports/ServicoToken.js";
import { SessaoNaoAutorizada } from "../../use-cases/errors/SessaoNaoAutorizada.js";

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
    }
  }
}

export function criarMiddlewareAutenticacao(tokens: ServicoToken) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = req.header("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    const usuarioId = token ? tokens.verificar(token) : null;
    if (!usuarioId) return next(new SessaoNaoAutorizada());
    req.usuarioId = usuarioId;
    next();
  };
}
