import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Customer = {
  id: string;
  name: string;
  alias: string | null;
  code: string | null;
  cpf: string | null;
  gender: "male" | "female" | "unkown" | null;
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

type CustomersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { customer: Customer }[];
};

export const getCustomers = cache(async (): Promise<Customer[] | ApiError> => {
  const res = await apiFetch<CustomersResponse>("/contacts/customers", {
    method: "GET",
  });
  if ("error" in res) return res;
  return res.results.map((r) => r.customer);
});

export const getCustomerByID = cache(
  async (id: string): Promise<Customer | ApiError> => {
    const res = await apiFetch<{ customer: Customer }>(
      `/contacts/customers/${id}`,
      { method: "GET" },
    );
    if ("error" in res) return res;
    return res.customer;
  },
);

export async function createCustomer(data: {
  name: string;
  alias?: string;
  code?: string;
  cpf?: string;
  gender?: "male" | "female" | "unkown";
  phone?: string;
  email?: string;
  postcode?: string;
  city?: string;
  state?: string;
  address?: string;
  notes?: string;
}): Promise<Customer | ApiError> {
  return apiFetch("/contacts/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    alias?: string | null;
    code?: string | null;
    cpf?: string | null;
    gender?: "male" | "female" | "unkown" | null;
    is_active?: boolean;
    phone?: string | null;
    email?: string | null;
    postcode?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    notes?: string | null;
  },
): Promise<Customer | ApiError> {
  return apiFetch(`/contacts/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: string): Promise<void | ApiError> {
  return apiFetch(`/contacts/customers/${id}`, {
    method: "DELETE",
  });
}
