import type { NextFunction, Request, Response } from "express";
import type { Controller } from "../../interfaces/controllers/Http.js";
import { DadosInvalidos } from "../../use-cases/errors/DadosInvalidos.js";

export const adaptarController = (controller: Controller) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body !== undefined && (typeof req.body !== "object" || Array.isArray(req.body))) {
        throw new DadosInvalidos("Corpo JSON inválido");
      }
      const resultado = await controller.executar({
        usuarioId: req.usuarioId,
        body: req.body as Record<string, unknown> | undefined,
        params: req.params as Record<string, string>,
        query: req.query as Record<string, string | string[] | undefined>
      });
      if (resultado.status === 204) {
        res.status(204).send();
        return;
      }
      res.status(resultado.status).json(resultado.body);
    } catch (erro) {
      next(erro);
    }
  };
