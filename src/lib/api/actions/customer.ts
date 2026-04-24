"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
} from "../customers";
import { searchContacts } from "../contacts";

export type CustomerActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function createCustomerAction(
  _: unknown,
  formData: FormData,
): Promise<CustomerActionState> {
  const res = await createCustomer({
    name: formData.get("name") as string,
    alias: (formData.get("alias") as string) || undefined,
    code: (formData.get("code") as string) || undefined,
    cpf: (formData.get("cpf") as string) || undefined,
    gender:
      (formData.get("gender") as "male" | "female" | "unkown") || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    postcode: (formData.get("postcode") as string) || undefined,
    city: (formData.get("city") as string) || undefined,
    state: (formData.get("state") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  console.log(res);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/contatos");
}

export async function updateCustomerAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<CustomerActionState> {
  const res = await updateCustomer(id, {
    name: (formData.get("name") as string) || undefined,
    alias: (formData.get("alias") as string) || null,
    code: (formData.get("code") as string) || null,
    cpf: (formData.get("cpf") as string) || null,
    gender: (formData.get("gender") as "male" | "female" | "unkown") || null,
    is_active: formData.get("is_active") === "on",
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    postcode: (formData.get("postcode") as string) || null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    address: (formData.get("address") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/contatos");
}

export async function deleteCustomerAction(
  id: string,
): Promise<CustomerActionState> {
  const res = await deleteCustomer(id);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/contatos");
}

export async function searchCustomersAction(
  query: string,
): Promise<Customer[]> {
  const res = await searchContacts(query);
  if (isApiError(res)) return [];

  return res
    .filter((c) => c.kind === "customer")
    .map(({ kind, ...c }) => c as Customer)
    .sort((a, b) => a.name.localeCompare(b.name));
}