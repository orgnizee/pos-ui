"use server";

import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  getProducts,
  Product,
  updateProduct,
} from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";

export type ProductActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function createProductAction(
  _: unknown,
  formData: FormData,
): Promise<ProductActionState> {
  const stockValue = formData.get("stock") as string;

  const res = await createProduct({
    name: formData.get("name") as string,
    barcode: (formData.get("barcode") as string) || undefined,
    origin: (formData.get("origin") as string) || undefined,
    unit: (formData.get("unit") as string) || undefined,
    ncm: (formData.get("ncm") as string) || undefined,
    sku: (formData.get("sku") as string) || undefined,
    cest: (formData.get("cest") as string) || undefined,
    price: (formData.get("price") as string) || undefined,
    cost: (formData.get("cost") as string) || undefined,
    stock: stockValue ? Number(stockValue) : undefined,
    brand: (formData.get("brand") as string) || undefined,
    track_stock: formData.get("track_stock") === "on",
    is_available: formData.get("is_available") === "on",
    is_active: formData.get("is_active") === "on",
    category: (formData.get("category") as string) || null,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/produtos");
}

export async function updateProductAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<ProductActionState> {
  const stockValue = formData.get("stock") as string;

  const res = await updateProduct(id, {
    name: (formData.get("name") as string) || undefined,
    barcode: (formData.get("barcode") as string) || null,
    origin: (formData.get("origin") as string) || null,
    unit: (formData.get("unit") as string) || null,
    ncm: (formData.get("ncm") as string) || null,
    sku: (formData.get("sku") as string) || null,
    cest: (formData.get("cest") as string) || null,
    price: (formData.get("price") as string) || null,
    cost: (formData.get("cost") as string) || null,
    stock: stockValue ? Number(stockValue) : undefined,
    brand: (formData.get("brand") as string) || null,
    track_stock: formData.get("track_stock") === "on",
    is_available: formData.get("is_available") === "on",
    is_active: formData.get("is_active") === "on",
    category: (formData.get("category") as string) || null,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/produtos");
}

export async function deleteProductAction(
  id: string,
): Promise<ProductActionState> {
  const res = await deleteProduct(id);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/produtos");
}

export async function searchProductsAction(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const res = await getProducts({ search: query, is_active: true });
  return isApiError(res) ? [] : res;
}
