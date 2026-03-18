import { ApiError } from "./types";

interface ApiErrorEnvelope {
  error?: {
    status?: number;
    message?: string;
    details?: unknown;
    [key: string]: unknown;
  };
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "requisição inválida",
  401: "dados incorretos",
  403: "acesso não permitido",
  404: "recurso não encontrado",
  409: "conflito com dados existentes",
  422: "dados inválidos",
  429: "muitas tentativas. tente novamente mais tarde",
};

export function buildApiError(status: number, body: unknown): ApiError {
  const envelope = (body as ApiErrorEnvelope)?.error;

  const message =
    STATUS_MESSAGES[status] ?? envelope?.message ?? "erro desconhecido.";

  return {
    error: (envelope ?? {}) as Record<string, unknown>,
    status: (envelope?.status ?? status) as number,
    message,
    details: envelope?.details,
  };
}
