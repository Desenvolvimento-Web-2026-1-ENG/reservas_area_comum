export interface CadastrarEspacoDto {
  nome: string;
  descricao: string;
  capacidade: number;
  regras: string;
}

export interface AtualizarEspacoDto {
  nome?: string;
  descricao?: string;
  capacidade?: number;
  regras?: string;
}
