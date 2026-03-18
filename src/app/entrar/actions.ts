"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/api/token";
import { isApiError } from "@/lib/api/types";

export type TokenActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

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

  const cookieStore = await cookies();
  cookieStore.set("access", res.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}
