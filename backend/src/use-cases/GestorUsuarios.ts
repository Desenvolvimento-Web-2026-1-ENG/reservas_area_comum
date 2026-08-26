import type { RepositorioUsuario } from "../repositories/RepositorioUsuario.js";
import type { CriptografadorSenha } from "./ports/CriptografadorSenha.js";
import type { GeradorIdentificador } from "./ports/GeradorIdentificador.js";
import type { FonteDeTempo } from "./ports/FonteDeTempo.js";
import type { ServicoToken } from "./ports/ServicoToken.js";
import type { CadastrarUsuarioDto, UsuarioDto } from "./dtos/UsuarioDto.js";
import type { AutenticarDto, AutenticacaoDto } from "./dtos/AutenticacaoDto.js";
import type { Usuario } from "../entities/Usuario.js";
import { exigirTexto } from "../entities/validacoes.js";
import { OperacaoConflitante } from "./errors/OperacaoConflitante.js";
import { CredenciaisRejeitadas } from "./errors/CredenciaisRejeitadas.js";
import { DadosInvalidos } from "./errors/DadosInvalidos.js";
import { RecursoAusente } from "./errors/RecursoAusente.js";
import type { ControleAcesso } from "./ControleAcesso.js";

interface Dependencias {
  usuarios: RepositorioUsuario;
  senhas: CriptografadorSenha;
  tokens: ServicoToken;
  ids: GeradorIdentificador;
  tempo: FonteDeTempo;
  autorizacao: ControleAcesso;
}

function paraDto(usuario: Usuario): UsuarioDto {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel, criadoEm: usuario.criadoEm };
}

export class GestorUsuarios {
  constructor(private readonly dependencias: Dependencias) {}

  async cadastrar(dto: CadastrarUsuarioDto): Promise<UsuarioDto> {
    const nome = exigirTexto(dto.nome, "nome");
    const email = exigirTexto(dto.email, "email").toLowerCase();
    if (dto.senha?.length < 6) throw new DadosInvalidos("A senha deve ter ao menos 6 caracteres");
    if (dto.papel !== "MORADOR" && dto.papel !== "ZELADOR") {
      throw new DadosInvalidos("O campo papel deve ser MORADOR ou ZELADOR");
    }

    const existente = await this.dependencias.usuarios.buscarPorEmail(email);
    if (existente) throw new OperacaoConflitante("Já existe um usuário cadastrado com este email");

    const usuario: Usuario = {
      id: this.dependencias.ids.gerar(),
      nome,
      email,
      senhaCriptografada: await this.dependencias.senhas.criptografar(dto.senha),
      papel: dto.papel,
      criadoEm: this.dependencias.tempo.agora()
    };

    await this.dependencias.usuarios.salvar(usuario);
    return paraDto(usuario);
  }

  async autenticar(dto: AutenticarDto): Promise<AutenticacaoDto> {
    const email = (dto.email ?? "").trim().toLowerCase();
    const usuario = email ? await this.dependencias.usuarios.buscarPorEmail(email) : null;
    if (!usuario) throw new CredenciaisRejeitadas();

    const senhaValida = await this.dependencias.senhas.comparar(dto.senha ?? "", usuario.senhaCriptografada);
    if (!senhaValida) throw new CredenciaisRejeitadas();

    const token = this.dependencias.tokens.gerar(usuario.id);
    return { token, usuario: paraDto(usuario) };
  }

  async buscarPorId(id: string): Promise<UsuarioDto> {
    const usuario = await this.dependencias.usuarios.buscarPorId(id);
    if (!usuario) throw new RecursoAusente("Usuário");
    return paraDto(usuario);
  }

  async listarTodos(zeladorId: string): Promise<UsuarioDto[]> {
    await this.dependencias.autorizacao.exigirZelador(zeladorId);
    return (await this.dependencias.usuarios.listarTodos()).map(paraDto);
  }
}
