export interface ServicoToken {
  gerar(usuarioId: string): string;
  verificar(token: string): string | null;
  revogarTodos(usuarioId: string): void;
}
