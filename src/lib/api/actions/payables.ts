"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import {
  createPayable,
  deletePayable,
  RecurrenceOption,
  updatePayable,
  Weekday,
} from "../payables";

export type PayableActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function createPayableAction(
  _: unknown,
  formData: FormData,
): Promise<PayableActionState> {
  const installment_count = formData.get("installment_count");
  const due_day_of_month = formData.get("due_day_of_month");

  const res = await createPayable({
    contact: formData.get("contact") as string,
    category: (formData.get("category") as string) || undefined,
    issued_at: formData.get("issued_at") as string,
    due_at: formData.get("due_at") as string,
    total_amount: formData.get("total_amount") as string,
    recurrence: (formData.get("recurrence") as RecurrenceOption) || undefined,
    installment_count: installment_count
      ? Number(installment_count)
      : undefined,
    due_weekday: (formData.get("due_weekday") as Weekday) || undefined,
    due_day_of_month: due_day_of_month ? Number(due_day_of_month) : undefined,
    reference: (formData.get("reference") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/pagamentos");
}

export async function updatePayableAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<PayableActionState> {
  const res = await updatePayable(id, {
    contact: (formData.get("contact") as string) || undefined,
    category: (formData.get("category") as string) || null,
    issued_at: (formData.get("issued_at") as string) || undefined,
    due_at: (formData.get("due_at") as string) || undefined,
    total_amount: (formData.get("total_amount") as string) || undefined,
    payment_method: (formData.get("payment_method") as string) || null,
    reference: (formData.get("reference") as string) || null,
    notes: (formData.get("notes") as string) || undefined,
  });

  console.log(res);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/pagamentos");
}

export async function deletePayableAction(
  id: string,
): Promise<PayableActionState> {
  const res = await deletePayable(id);

  if (isApiError(res)) {
    return {
      error: true,
      message: "conta paga. exclua pagamento no caixa primeiro",
      details: res.details,
    };
  }

  redirect("/pagamentos");
}
