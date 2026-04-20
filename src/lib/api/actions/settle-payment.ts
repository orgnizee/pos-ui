"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { settlePayment } from "../settle-payment";

export type SettlePaymentActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function settlePaymentAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<SettlePaymentActionState> {
  const res = await settlePayment(id, {
    amount: formData.get("amount") as string,
    account: formData.get("account") as string,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/receber");
}
