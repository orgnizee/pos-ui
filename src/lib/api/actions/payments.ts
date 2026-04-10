"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import {
  createPayment,
  updatePayment,
  deletePayment,
  PaymentType,
  PaymentStatus,
  RecurrenceOption,
  Weekday,
} from "../payments";

export type PaymentActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function createPaymentAction(
  _: unknown,
  formData: FormData,
): Promise<PaymentActionState> {
  const installment_count = formData.get("installment_count");
  const due_day_of_month = formData.get("due_day_of_month");

  const res = await createPayment({
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

  redirect("/receber");
}

export async function updatePaymentAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<PaymentActionState> {
  const installment_count = formData.get("installment_count");
  const due_day_of_month = formData.get("due_day_of_month");

  const res = await updatePayment(id, {
    contact: (formData.get("contact") as string) || undefined,
    category: (formData.get("category") as string) || null,
    issued_at: (formData.get("issued_at") as string) || undefined,
    due_at: (formData.get("due_at") as string) || undefined,
    total_amount: (formData.get("total_amount") as string) || undefined,
    amount_paid: (formData.get("amount_paid") as string) || undefined,
    payment_type: (formData.get("payment_type") as PaymentType) || undefined,
    status: (formData.get("status") as PaymentStatus) || undefined,
    paid_at: (formData.get("paid_at") as string) || null,
    payment_method: (formData.get("payment_method") as string) || null,
    recurrence: (formData.get("recurrence") as RecurrenceOption) || undefined,
    installment_count: installment_count ? Number(installment_count) : null,
    due_weekday: (formData.get("due_weekday") as Weekday) || null,
    due_day_of_month: due_day_of_month ? Number(due_day_of_month) : null,
    reference: (formData.get("reference") as string) || null,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/receber");
}

export async function deletePaymentAction(
  id: string,
): Promise<PaymentActionState> {
  const res = await deletePayment(id);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/receber");
}
