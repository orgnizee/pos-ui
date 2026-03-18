import { ApiError } from "./types";
import { buildApiError } from "./errors";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | ApiError> {
  const res = await fetch(`${process.env.LOCAL_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type");
  let body = null;
  if (contentType?.includes("application/json")) {
    body = await res.json();
  }

  if (!res.ok && res.status < 500) {
    return buildApiError(res.status, body);
  }

  if (!res.ok) {
    throw new Error(`erro interno do servidor.`);
  }

  return body as T;
}
