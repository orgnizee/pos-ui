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

export async function getTotalBalance(): Promise<Balance | ApiError> {
  return apiFetch("/finance/total-balance", {
    method: "get",
  });
}
