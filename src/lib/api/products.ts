import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Product = {
  id: string;
  name: string;
  barcode: string | null;
  origin: string | null;
  unit: string | null;
  ncm: string | null;
  sku: string | null;
  cest: string | null;
  price: string | null;
  cost: string | null;
  stock: number;
  brand: string | null;
  track_stock: boolean;
  is_available: boolean;
  is_active: boolean;
  category: {
    id: string;
    name: string;
  };
  supplier: string[];
};

type ProductResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { product: Product }[];
};

export const getProducts = cache(
  async (filters?: {
    search?: string;
    is_active?: boolean;
    is_available?: boolean;
    category?: string;
  }): Promise<Product[] | ApiError> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.is_active !== undefined)
      params.set("is_active", String(filters.is_active));
    if (filters?.is_available !== undefined)
      params.set("is_available", String(filters.is_available));
    if (filters?.category) params.set("category", filters.category);

    const query = params.size ? `?${params.toString()}` : "";
    const res = await apiFetch<ProductResponse>(`/products${query}`, {
      method: "GET",
    });

    if ("error" in res) return res;
    return res.results.map((r) => r.product);
  },
);

export const getProductByID = cache(
  async (id: string): Promise<Product | ApiError> => {
    const res = await apiFetch<{ product: Product }>(`/products/${id}`, {
      method: "GET",
    });

    if ("error" in res) return res;
    return res.product;
  },
);

export async function createProduct(data: {
  name: string;
  barcode?: string;
  origin?: string;
  unit?: string;
  ncm?: string;
  sku?: string;
  cest?: string;
  price?: string;
  cost?: string;
  stock?: number;
  brand?: string;
  track_stock?: boolean;
  is_available?: boolean;
  is_active?: boolean;
  category?: string | null;
  supplier?: string[];
}): Promise<Product | ApiError> {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    barcode?: string | null;
    origin?: string | null;
    unit?: string | null;
    ncm?: string | null;
    sku?: string | null;
    cest?: string | null;
    price?: string | null;
    cost?: string | null;
    stock?: number;
    brand?: string | null;
    track_stock?: boolean;
    is_available?: boolean;
    is_active?: boolean;
    category?: string | null;
    supplier?: string[];
  },
): Promise<Product | ApiError> {
  return apiFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void | ApiError> {
  return apiFetch(`/products/${id}`, { method: "DELETE" });
}
