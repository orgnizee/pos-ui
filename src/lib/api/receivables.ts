import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

import { Customer } from "./customers";

export type PaymentStatus = "pending" | "paid" | "overdue" | "partially_paid";
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

export type Receivable = {
  id: string;
  contact: Customer;
  category: {
    id: string;
    name: string;
  } | null;
  issued_at: string;
  due_at: string;
  total_amount: string;
  amount_paid: string;
  outstanding_balance: string;
  payment_type: PaymentType;
  status: PaymentStatus;
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

type ReceivableResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { payment: Receivable }[];
  total: string,
  total_overdue: string,
  total_paid: string,
  total_to_be_paid: string,
};

export const getReceivables = cache(
  async (filters?: {
    type?: PaymentType;
    status?: PaymentStatus;
    search?: string;
    date?: string; // "today" | "week" | "month" | "YYYY-MM-DD"
    start_date?: string;
    end_date?: string;
    sort?: string;
    page?: string;
  }): Promise<ReceivableResponse | ApiError> => {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.date) params.set("date", filters.date);
    if (filters?.start_date) params.set("start_date", filters.start_date);
    if (filters?.end_date) params.set("end_date", filters.end_date);
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.page) params.set("page", filters.page);
    const query = params.size ? `?${params.toString()}` : "";
    const res = await apiFetch<ReceivableResponse>(`/receivables${query}`, {
      method: "GET",
    });
    if ("error" in res) return res;
    return res;
  },
);

export const getReceivableByID = cache(
  async (id: string): Promise<Receivable | ApiError> => {
    const res = await apiFetch<{ payment: Receivable }>(`/receivables/${id}`, {
      method: "GET",
    });
    if ("error" in res) return res;
    return res.payment;
  },
);

export async function createReceivable(data: {
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
}): Promise<Receivable | ApiError> {
  return apiFetch("/receivables", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReceivable(
  id: string,
  data: {
    contact?: string;
    category?: string | null;
    issued_at?: string;
    due_at?: string;
    total_amount?: string;
    payment_method?: string | null;
    reference?: string | null;
    notes?: string;
  },
): Promise<Receivable | ApiError> {
  return apiFetch(`/receivables/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteReceivable(id: string): Promise<void | ApiError> {
  return apiFetch(`/receivables/${id}`, { method: "DELETE" });
}
