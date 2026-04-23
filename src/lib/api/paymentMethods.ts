import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type PaymentMethodDestination = "receivable" | "finance_account";

export type PaymentMethod = {
  id: string;
  description: string;
  is_active: boolean;
  destination: PaymentMethodDestination;
  finance_account: string | null;
};

type PaymentMethodsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<PaymentMethod | { payment_method: PaymentMethod }>;
};

function unwrapPaymentMethod(
  paymentMethod: PaymentMethod | { payment_method: PaymentMethod },
): PaymentMethod {
  if ("payment_method" in paymentMethod) return paymentMethod.payment_method;
  return paymentMethod;
}

export const getPaymentMethods = cache(
  async (): Promise<PaymentMethod[] | ApiError> => {
    const res = await apiFetch<PaymentMethodsResponse>("/payment-methods", {
      method: "GET",
    });

    if ("error" in res) return res;

    return res.results.map(unwrapPaymentMethod);
  },
);

export const getPaymentMethodByID = cache(
  async (id: string): Promise<PaymentMethod | ApiError> => {
    const res = await apiFetch<
      PaymentMethod | { payment_method: PaymentMethod }
    >(`/payment-methods/${id}`, {
      method: "GET",
    });

    if ("error" in res) return res;

    return unwrapPaymentMethod(res);
  },
);

export async function createPaymentMethod(data: {
  description: string;
  destination: PaymentMethodDestination;
  is_active?: boolean;
  finance_account?: string | null;
}): Promise<PaymentMethod | ApiError> {
  return apiFetch("/payment-methods", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePaymentMethod(
  id: string,
  data: {
    description?: string;
    destination?: PaymentMethodDestination;
    is_active?: boolean;
    finance_account?: string | null;
  },
): Promise<PaymentMethod | ApiError> {
  return apiFetch(`/payment-methods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePaymentMethod(
  id: string,
): Promise<void | ApiError> {
  return apiFetch(`/payment-methods/${id}`, {
    method: "DELETE",
  });
}
