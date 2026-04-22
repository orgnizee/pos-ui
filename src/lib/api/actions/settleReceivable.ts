"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { settleReceivable } from "../settleReceivable";

export type SettleReceivableActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function settleReceivableAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<SettleReceivableActionState> {
  const res = await settleReceivable(id, {
    amount: formData.get("amount") as string,
    account: formData.get("account") as string,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/receber");
}
