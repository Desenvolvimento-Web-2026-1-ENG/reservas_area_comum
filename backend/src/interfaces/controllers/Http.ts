export interface HttpRequest {
  usuarioId?: string | undefined;
  body?: Record<string, unknown> | undefined;
  params?: Record<string, string> | undefined;
  query?: Record<string, string | string[] | undefined> | undefined;
}

export interface HttpResponse {
  status: number;
  body: unknown;
}

export interface Controller {
  executar(request: HttpRequest): Promise<HttpResponse>;
}

export const resposta = (body: unknown, status = 200): HttpResponse => ({ status, body });

export const texto = (obj: Record<string, unknown> | undefined, campo: string): string =>
  typeof obj?.[campo] === "string" ? (obj[campo] as string) : "";

export const numero = (obj: Record<string, unknown> | undefined, campo: string): number =>
  typeof obj?.[campo] === "number" ? (obj[campo] as number) : Number.NaN;
