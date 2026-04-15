import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

import { FinanceCategory } from "./finance-category";
import { Supplier } from "./suppliers";

export type PayableStatus = "pending" | "paid" | "overdue" | "partially_paid";
export type PaymentType = "payable" | "receivable";
export type RecurrenceOption = "once" | "weekly" | "monthly" | "installments";
export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Payable = {
  id: string;
  contact: Supplier;
  category: FinanceCategory | null;
  issued_at: string;
  due_at: string;
  total_amount: string;
  amount_paid: string;
  outstanding_balance: string;
  payment_type: PaymentType;
  status: PayableStatus;
  paid_at: string | null;
  payment_method: string | null;
  recurrence: RecurrenceOption;
  installment_count: number | null;
  due_weekday: Weekday | null;
  due_day_of_month: number | null;
  reference: string | null;
  notes: string;
  updated_at: string;
};

type PayableResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { payable: Payable }[];
};

export const getPayables = cache(
  async (filters?: {
    type?: PaymentType;
    status?: PayableStatus;
    search?: string;
    date?: string; // "today" | "week" | "month" | "YYYY-MM-DD"
    start_date?: string;
    end_date?: string;
  }): Promise<Payable[] | ApiError> => {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.date) params.set("date", filters.date);
    if (filters?.start_date) params.set("start_date", filters.start_date);
    if (filters?.end_date) params.set("end_date", filters.end_date);
    const query = params.size ? `?${params.toString()}` : "";
    const res = await apiFetch<PayableResponse>(`/payables${query}`, {
      method: "GET",
    });
    if ("error" in res) return res;
    return res.results.map((r) => r.payable);
  },
);

export const getPayableByID = cache(
  async (id: string): Promise<Payable | ApiError> => {
    return apiFetch<Payable>(`/payables/${id}`, { method: "GET" });
  },
);

export async function createPayable(data: {
  contact: string;
  category?: string;
  issued_at: string;
  due_at: string;
  total_amount: string;
  recurrence?: RecurrenceOption;
  installment_count?: number;
  due_weekday?: Weekday;
  due_day_of_month?: number;
  reference?: string;
  notes?: string;
}): Promise<Payable | ApiError> {
  return apiFetch("/payables", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePayable(
  id: string,
  data: {
    contact?: string;
    category?: string | null;
    issued_at?: string;
    due_at?: string;
    total_amount?: string;
    amount_paid?: string;
    payment_type?: PaymentType;
    status?: PayableStatus;
    paid_at?: string | null;
    payment_method?: string | null;
    recurrence?: RecurrenceOption;
    installment_count?: number | null;
    due_weekday?: Weekday | null;
    due_day_of_month?: number | null;
    reference?: string | null;
    notes?: string;
  },
): Promise<Payable | ApiError> {
  return apiFetch(`/payables/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePayable(id: string): Promise<void | ApiError> {
  return apiFetch(`/payables/${id}`, { method: "DELETE" });
}
