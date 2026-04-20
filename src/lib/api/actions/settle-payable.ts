"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { settlePayable } from "../settle-payable";

export type SettlePaymentActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function settlePayableAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<SettlePaymentActionState> {
  const res = await settlePayable(id, {
    amount: formData.get("amount") as string,
    account: formData.get("account") as string,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/pagar");
}
