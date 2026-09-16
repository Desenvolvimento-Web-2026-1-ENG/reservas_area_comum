import { Router } from "express";
import type { ServicoToken } from "../../use-cases/ports/ServicoToken.js";
import type { Controller } from "../../interfaces/controllers/Http.js";
import { adaptarController } from "./AdaptarController.js";
import { criarMiddlewareAutenticacao } from "./MiddlewareAutenticacao.js";

interface Controllers {
  cadastrarUsuario: Controller;
  autenticar: Controller;
  buscarMeuUsuario: Controller;
  atualizarMeuUsuario: Controller;
  listarUsuarios: Controller;
  cadastrarEspaco: Controller;
  atualizarEspaco: Controller;
  removerEspaco: Controller;
  listarEspacos: Controller;
  buscarEspaco: Controller;
  criarReserva: Controller;
  listarReservasDoEspaco: Controller;
  consultarDisponibilidade: Controller;
  listarReservasPendentes: Controller;
  listarCancelamentosPendentes: Controller;
  listarMinhasReservas: Controller;
  aprovarReserva: Controller;
  recusarReserva: Controller;
  solicitarCancelamento: Controller;
  aprovarCancelamento: Controller;
  recusarCancelamento: Controller;
}

export function criarRotas(c: Controllers, tokens: ServicoToken) {
  const rotas = Router();

  // públicas
  rotas.post("/usuarios", adaptarController(c.cadastrarUsuario));
  rotas.post("/autenticacao/entrar", adaptarController(c.autenticar));

  // a partir daqui, todas as rotas exigem token válido
  rotas.use(criarMiddlewareAutenticacao(tokens));

  rotas.get("/usuarios/me", adaptarController(c.buscarMeuUsuario));
  rotas.patch("/usuarios/me", adaptarController(c.atualizarMeuUsuario));
  rotas.get("/usuarios", adaptarController(c.listarUsuarios)); // zelador

  // espaços
  rotas.post("/espacos", adaptarController(c.cadastrarEspaco)); // zelador
  rotas.get("/espacos", adaptarController(c.listarEspacos));
  rotas.get("/espacos/:espacoId", adaptarController(c.buscarEspaco));
  rotas.patch("/espacos/:espacoId", adaptarController(c.atualizarEspaco)); // zelador
  rotas.delete("/espacos/:espacoId", adaptarController(c.removerEspaco)); // zelador

  // reservas
  rotas.post("/espacos/:espacoId/reservas", adaptarController(c.criarReserva)); // morador
  rotas.get("/espacos/:espacoId/reservas", adaptarController(c.listarReservasDoEspaco)); // calendário do espaço
  rotas.get("/espacos/:espacoId/disponibilidade", adaptarController(c.consultarDisponibilidade));
  rotas.get("/reservas/minhas", adaptarController(c.listarMinhasReservas)); // morador
  rotas.get("/reservas/pendentes", adaptarController(c.listarReservasPendentes)); // zelador
  rotas.get("/reservas/cancelamentos-pendentes", adaptarController(c.listarCancelamentosPendentes)); // zelador
  rotas.patch("/reservas/:reservaId/aprovacao", adaptarController(c.aprovarReserva)); // zelador
  rotas.patch("/reservas/:reservaId/recusa", adaptarController(c.recusarReserva)); // zelador
  rotas.post("/reservas/:reservaId/cancelamento", adaptarController(c.solicitarCancelamento)); // morador
  rotas.patch("/reservas/:reservaId/cancelamento/aprovacao", adaptarController(c.aprovarCancelamento)); // zelador
  rotas.patch("/reservas/:reservaId/cancelamento/recusa", adaptarController(c.recusarCancelamento)); // zelador

  return rotas;
}
