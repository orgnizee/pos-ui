"use server";
import { getProducts } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";
import { Product } from "@/lib/api/products";

export async function searchProductsAction(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const res = await getProducts({ search: query, is_active: true });
  return isApiError(res) ? [] : res;
}
