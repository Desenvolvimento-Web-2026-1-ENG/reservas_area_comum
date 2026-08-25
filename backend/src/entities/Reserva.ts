export type StatusReserva =
  | "PENDENTE"
  | "APROVADA"
  | "RECUSADA"
  | "CANCELAMENTO_SOLICITADO"
  | "CANCELADA";

export interface Reserva {
  id: string;
  usuarioId: string;
  espacoId: string;
  data: string; // formato "AAAA-MM-DD"
  horaInicio: string; // formato "HH:mm"
  horaFim: string; // formato "HH:mm"
  status: StatusReserva;
  // guarda o status anterior a uma solicitação de cancelamento, para permitir reverter caso o zelador recuse
  estadoAnterior?: StatusReserva;
  criadaEm: Date;
}
