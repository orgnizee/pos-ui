"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { createBankAccount, updateBankAccount } from "../bank-accounts";

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

  console.log(res);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/caixa");
}

export async function submitUpdateBankAccountFormAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<BankAccountActionState> {
  let isActive = false

  if (formData.get("is_active") !== "on") {
    isActive = true
  }

  const res = await updateBankAccount(id, {
    name: formData.get("bank") as string | null,
    is_active: isActive,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }
  redirect("/caixa");
}
