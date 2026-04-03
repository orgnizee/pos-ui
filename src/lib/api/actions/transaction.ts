"use server";

import { redirect } from "next/navigation";
import { submitTransaction } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";

export type TransactionActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function submitTransactionFormAction(
  _: unknown,
  formData: FormData,
): Promise<TransactionActionState> {
  const res = await submitTransaction({
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    account: formData.get("account") as string,
    contact: formData.get("contact") as string,
    amount: formData.get("amount") as string,
    description: formData.get("description") as string,
  });

  console.log(res)

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/caixa");
}
