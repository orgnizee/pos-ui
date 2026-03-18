export type ApiError = {
  error: Record<string, unknown>;
  status: number;
  message: string;
  details?: unknown;
};

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value &&
    "error" in value
  );
}
