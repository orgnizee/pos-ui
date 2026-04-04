import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Supplier = {
  id: string;
  legal_name: string;
  trade_name: string;
};

type SuppliersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { supplier: Supplier }[];
};

export const getSuppliers = cache(
  async (): Promise<Supplier[] | ApiError> => {
    const res = await apiFetch<SuppliersResponse>("/contacts/suppliers", {
      method: "GET",
    });

    if ("error" in res) return res;

    return res.results.map((r) => r.supplier);
  },
);
