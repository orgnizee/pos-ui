import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Transaction = {
  id: string;
  type: string;
  category: {
    id: string;
    name: string;
  };
  operator: {
    id: string;
    name: string;
  };
  account: {
    id: string;
    name: string;
  };
  contact: {
    id: string;
    name: string;
  };
  payment: string;
  linked: string;
  amount: string;
  description: string;
  timestamp: string;
};

type TransactionsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { transaction: Transaction }[];
};

export async function createTransaction(data: {
  type: string;
  category: string;
  account: string;
  contact: string;
  amount: string;
  description: string;
  send_to: string;
}): Promise<Transaction | ApiError> {
  return apiFetch("/finance/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export const getTransactions = cache(
  async (
    params?: Record<string, string>,
  ): Promise<Transaction[] | ApiError> => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    const res = await apiFetch<TransactionsResponse>(
      `/finance/transactions${query}`,
      {
        method: "GET",
      },
    );
    if ("error" in res) return res;
    return res.results.map((r) => r.transaction);
  },
);

export async function getTransactionByID(
  id: string,
): Promise<Transaction | ApiError> {
  const res = await apiFetch<{ transaction: Transaction }>(
    `/finance/transactions/${id}`,
    {
      method: "GET",
    },
  );

  if ("error" in res) return res;

  return res.transaction;
}

export async function deleteTransactionByID(
  id: string,
): Promise<null | ApiError> {
  const res = await apiFetch<never>(`/finance/transactions/${id}`, {
    method: "DELETE",
  });

  if ("error" in res) return res;

  return null;
}
