import express from "express";
import cors from "cors";
import type { Express } from "express";

import { RepositorioUsuarioEmMemoria } from "../infrastructure/database/RepositorioUsuarioEmMemoria.js";
import { RepositorioEspacoEmMemoria } from "../infrastructure/database/RepositorioEspacoEmMemoria.js";
import { RepositorioReservaEmMemoria } from "../infrastructure/database/RepositorioReservaEmMemoria.js";
import { PrismaRepositorioUsuario } from "../infrastructure/database/PrismaRepositorioUsuario.js";
import { PrismaRepositorioEspaco } from "../infrastructure/database/PrismaRepositorioEspaco.js";
import { PrismaRepositorioReserva } from "../infrastructure/database/PrismaRepositorioReserva.js";

import { CriptografadorSenhaScrypt } from "../infrastructure/services/CriptografadorSenhaScrypt.js";
import { GeradorUuid } from "../infrastructure/services/GeradorUuid.js";
import { TempoDoSistema } from "../infrastructure/services/TempoDoSistema.js";
import { ServicoTokenEmMemoria } from "../infrastructure/services/ServicoTokenEmMemoria.js";

import { ControleAcesso } from "../use-cases/ControleAcesso.js";
import { GestorUsuarios } from "../use-cases/GestorUsuarios.js";
import { CatalogoEspacos } from "../use-cases/CatalogoEspacos.js";
import { AgendaReservas } from "../use-cases/AgendaReservas.js";

import { CadastrarUsuarioController } from "../interfaces/controllers/CadastrarUsuarioController.js";
import { AutenticacaoController } from "../interfaces/controllers/AutenticacaoController.js";
import { AtualizarMeuUsuarioController, BuscarMeuUsuarioController } from "../interfaces/controllers/UsuarioControllers.js";
import { ListarUsuariosController, ListarReservasPendentesController, ListarCancelamentosPendentesController } from "../interfaces/controllers/ListagensZeladorControllers.js";
import {
  CadastrarEspacoController,
  AtualizarEspacoController,
  RemoverEspacoController,
  ListarEspacosController,
  BuscarEspacoController
} from "../interfaces/controllers/EspacoControllers.js";
import {
  CriarReservaController,
  ListarReservasDoEspacoController,
  ConsultarDisponibilidadeController,
  ListarMinhasReservasController,
  AprovarReservaController,
  RecusarReservaController,
  SolicitarCancelamentoController,
  AprovarCancelamentoController,
  RecusarCancelamentoController
} from "../interfaces/controllers/ReservaControllers.js";

import { criarRotas } from "../infrastructure/http/Rotas.js";
import { tratarErros } from "../infrastructure/http/TratadorErros.js";
import { configurarDocumentacao } from "../infrastructure/http/OpenApi.js";

function montarNucleo() {
  // P2: persistência real com SQLite + Prisma ORM 6.
  // Os repositórios em memória originais permanecem no projeto para preservar a implementação da P1.
  const usuarios = new PrismaRepositorioUsuario();
  const espacos = new PrismaRepositorioEspaco();
  const reservas = new PrismaRepositorioReserva();

  const senhas = new CriptografadorSenhaScrypt();
  const ids = new GeradorUuid();
  const tempo = new TempoDoSistema();
  const tokens = new ServicoTokenEmMemoria();
  const autorizacao = new ControleAcesso(usuarios);

  const gestaoUsuarios = new GestorUsuarios({ usuarios, senhas, tokens, ids, tempo, autorizacao });
  const catalogoEspacos = new CatalogoEspacos({ espacos, autorizacao, ids, tempo });
  const agendaReservas = new AgendaReservas({ reservas, autorizacao, espacos: catalogoEspacos, ids, tempo });

  return { gestaoUsuarios, catalogoEspacos, agendaReservas, tokens };
}

export function configurarApi(): Express {
  const { gestaoUsuarios, catalogoEspacos, agendaReservas, tokens } = montarNucleo();

  // interface HTTP
  const rotas = criarRotas(
    {
      cadastrarUsuario: new CadastrarUsuarioController(gestaoUsuarios),
      autenticar: new AutenticacaoController(gestaoUsuarios),
      buscarMeuUsuario: new BuscarMeuUsuarioController(gestaoUsuarios),
      atualizarMeuUsuario: new AtualizarMeuUsuarioController(gestaoUsuarios),
      listarUsuarios: new ListarUsuariosController(gestaoUsuarios),
      cadastrarEspaco: new CadastrarEspacoController(catalogoEspacos),
      atualizarEspaco: new AtualizarEspacoController(catalogoEspacos),
      removerEspaco: new RemoverEspacoController(catalogoEspacos),
      listarEspacos: new ListarEspacosController(catalogoEspacos),
      buscarEspaco: new BuscarEspacoController(catalogoEspacos),
      criarReserva: new CriarReservaController(agendaReservas),
      listarReservasDoEspaco: new ListarReservasDoEspacoController(agendaReservas),
      consultarDisponibilidade: new ConsultarDisponibilidadeController(agendaReservas),
      listarReservasPendentes: new ListarReservasPendentesController(agendaReservas),
      listarCancelamentosPendentes: new ListarCancelamentosPendentesController(agendaReservas),
      listarMinhasReservas: new ListarMinhasReservasController(agendaReservas),
      aprovarReserva: new AprovarReservaController(agendaReservas),
      recusarReserva: new RecusarReservaController(agendaReservas),
      solicitarCancelamento: new SolicitarCancelamentoController(agendaReservas),
      aprovarCancelamento: new AprovarCancelamentoController(agendaReservas),
      recusarCancelamento: new RecusarCancelamentoController(agendaReservas)
    },
    tokens
  );

  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  configurarDocumentacao(app);

  app.get("/api/status", (_req, res) => res.json({ status: "online" }));
  app.get("/api/health", (_req, res) => res.json({ saudavel: true }));

  app.use(rotas);

  app.use(tratarErros);

  return app;
}
