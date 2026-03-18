"use server";
import { getToken } from "@/lib/api/token";
import { isApiError } from "@/lib/api/types";

export type TokenActionState =
  | { error: true; message: string; details?: unknown }
  | { success: true }
  | null;

export async function getTokenAction(
  _: unknown,
  formData: FormData,
): Promise<TokenActionState> {
  const res = await getToken({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  // res is Token here — do what you need, e.g. set a cookie
  return { success: true };
}
