"use server";

import { redirect } from "next/navigation";
import {
  deleteTransactionByID,
  createTransaction,
} from "@/lib/api/transaction";
import { ApiError, isApiError } from "@/lib/api/types";

export type TransactionActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function submitTransactionFormAction(
  _: unknown,
  formData: FormData,
): Promise<TransactionActionState> {
  const res = await createTransaction({
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    account: formData.get("account") as string,
    contact: formData.get("contact") as string,
    amount: formData.get("amount") as string,
    description: formData.get("description") as string,
    send_to: formData.get("send_to") as string,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/caixa");
}

export async function deleteTransactionAction(
  _: unknown,
  id: string,
): Promise<null | ApiError> {
  const res = await deleteTransactionByID(id);

  if (isApiError(res)) {
    return res;
  }

  redirect("/caixa");
}
