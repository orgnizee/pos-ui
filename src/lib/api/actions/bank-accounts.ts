"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { createBankAccount } from "../bank-accounts";

export type BankAccountActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function submitBankAccountFormAction(
  _: unknown,
  formData: FormData,
): Promise<BankAccountActionState> {
  const res = await createBankAccount({
    name: formData.get("bank") as string,
  });

  console.log(res)

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/caixa");
}
