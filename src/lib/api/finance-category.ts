import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type FinanceCategory = {
  id: string;
  name: string;
  parent: {
    id: string,
    name: string,
  };
  is_active: boolean;
};

type CategoriesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { category: FinanceCategory }[];
};

export const getFinanceCategories = cache(
  async (): Promise<FinanceCategory[] | ApiError> => {
    const res = await apiFetch<CategoriesResponse>("/finance/categories", {
      method: "GET",
    });

    if ("error" in res) return res;

    return res.results.map((r) => r.category);
  },
);

export async function createFinanceCategory(data: {
  name: string;
  parent: string;
  is_active: boolean;
}): Promise<FinanceCategory | ApiError> {
  return apiFetch("/finance/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
