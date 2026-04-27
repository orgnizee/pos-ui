import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type ProductCategory = {
  id: string;
  name: string;
  parent: string | null;
  is_active: boolean;
};

type ProductCategoryPayload = {
  id: string;
  name: string;
  parent: string | null;
  is_active: boolean;
};

type CategoriesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ({ product_category: ProductCategoryPayload } | { category: ProductCategoryPayload })[];
};

export const getProductCategories = cache(
  async (): Promise<ProductCategory[] | ApiError> => {
    const res = await apiFetch<CategoriesResponse>("/products/categories", {
      method: "GET",
    });

    if ("error" in res) return res;

    return res.results
      .map((r) => ("product_category" in r ? r.product_category : r.category))
      .filter((category) => category.is_active)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
);
