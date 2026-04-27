"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  redirect("/fiados");
}

type SettleBatchItem = {
  id: string;
  amount: string;
};

type SettledTransaction = {
  id: string;
  amount: string;
  account: { id: string; name: string };
  contact: { id: string | null; name: string | null };
  description: string;
  timestamp: string;
};

export type SettleBatchReceivableActionState =
  | {
      error: true;
      message: string;
      details?: unknown;
    }
  | {
      error: false;
      transactions: SettledTransaction[];
    }
  | null;

export async function settleBatchReceivablesAction(
  _: unknown,
  formData: FormData,
): Promise<SettleBatchReceivableActionState> {
  const account = formData.get("account");
  const itemsRaw = formData.get("items");

  if (typeof account !== "string" || !account) {
    return { error: true, message: "selecione uma conta." };
  }

  if (typeof itemsRaw !== "string" || !itemsRaw) {
    return { error: true, message: "selecione pelo menos um fiado." };
  }

  let items: SettleBatchItem[] = [];

  try {
    items = JSON.parse(itemsRaw) as SettleBatchItem[];
  } catch {
    return { error: true, message: "não foi possível processar os fiados." };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: true, message: "selecione pelo menos um fiado." };
  }

  const transactions: SettledTransaction[] = [];

  for (const item of items) {
    const res = await settleReceivable(item.id, {
      amount: item.amount,
      account,
    });

    if (isApiError(res)) {
      return { error: true, message: res.message, details: res.details };
    }

    transactions.push({
      id: res.transaction.id,
      amount: res.transaction.amount,
      account: res.transaction.account,
      contact: res.transaction.contact,
      description: res.transaction.description,
      timestamp: res.transaction.timestamp,
    });
  }

  revalidatePath("/fiados");
  revalidatePath("/caixa");

  return { error: false, transactions };
}
