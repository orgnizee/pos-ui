import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Account = {
  id: string;
  name: string;
  balance: string;
  created_at: string;
  is_active: boolean;
};

type Balance = {
  total_balance: string;
};

type AccountsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { account: Account }[];
};

export const getAccounts = cache(async (): Promise<Account[] | ApiError> => {
  const res = await apiFetch<AccountsResponse>("/finance/accounts", {
    method: "GET",
  });

  if ("error" in res) return res;

  return res.results.map((r) => r.account);
});

export const getAccountByID = cache(
  async (id: string): Promise<Account | ApiError> => {
    const res = await apiFetch<{ account: Account }>(
      `/finance/accounts/${id}`,
      {
        method: "GET",
      },
    );

    if ("error" in res) return res;

    return res.account;
  },
);

export async function getTotalBalance(): Promise<Balance | ApiError> {
  return apiFetch("/finance/total-balance", {
    method: "get",
  });
}

export async function createBankAccount(data: {
  name: string;
}): Promise<Account | ApiError> {
  return apiFetch("/finance/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBankAccount(
  id: string,
  data: {
    name: string | null;
    is_active: boolean;
  },
): Promise<Account | ApiError> {
  return apiFetch(`/finance/accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
