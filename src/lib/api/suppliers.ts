import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Supplier = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  code: string;
  cnpj: string | null;
  ie: string | null;
  im: string | null;
  is_active: boolean;
  phone: string | null;
  email: string | null;
  postcode: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type SuppliersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { supplier: Supplier }[];
};

export const getSuppliers = cache(async (): Promise<Supplier[] | ApiError> => {
  const res = await apiFetch<SuppliersResponse>("/contacts/suppliers", {
    method: "GET",
  });
  if ("error" in res) return res;
  return res.results.map((r) => r.supplier);
});

export const getSupplierByID = cache(
  async (id: string): Promise<Supplier | ApiError> => {
    const res = await apiFetch<{ supplier: Supplier }>(
      `/contacts/suppliers/${id}`,
      { method: "GET" },
    );
    if ("error" in res) return res;
    return res.supplier;
  },
);

export async function createSupplier(data: {
  legal_name: string;
  trade_name?: string;
  code?: string;
  cnpj?: string;
  ie?: string;
  im?: string;
  phone?: string;
  email?: string;
  postcode?: string;
  city?: string;
  state?: string;
  address?: string;
  notes?: string;
}): Promise<Supplier | ApiError> {
  return apiFetch("/contacts/suppliers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSupplier(
  id: string,
  data: {
    legal_name?: string;
    trade_name?: string | null;
    code?: string | null;
    cnpj?: string | null;
    ie?: string | null;
    im?: string | null;
    is_active?: boolean;
    phone?: string | null;
    email?: string | null;
    postcode?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    notes?: string | null;
  },
): Promise<Supplier | ApiError> {
  return apiFetch(`/contacts/suppliers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSupplier(id: string): Promise<void | ApiError> {
  return apiFetch(`/contacts/suppliers/${id}`, {
    method: "DELETE",
  });
}
