"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { createSupplier, updateSupplier, deleteSupplier } from "../suppliers";

export type SupplierActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function createSupplierAction(
  _: unknown,
  formData: FormData,
): Promise<SupplierActionState> {
  const res = await createSupplier({
    legal_name: formData.get("legal_name") as string,
    trade_name: (formData.get("trade_name") as string) || undefined,
    code: (formData.get("code") as string) || undefined,
    cnpj: (formData.get("cnpj") as string) || undefined,
    ie: (formData.get("ie") as string) || undefined,
    im: (formData.get("im") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    postcode: (formData.get("postcode") as string) || undefined,
    city: (formData.get("city") as string) || undefined,
    state: (formData.get("state") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/contatos");
}

export async function updateSupplierAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<SupplierActionState> {
  const res = await updateSupplier(id, {
    legal_name: (formData.get("legal_name") as string) || undefined,
    trade_name: (formData.get("trade_name") as string) || null,
    code: (formData.get("code") as string) || null,
    cnpj: (formData.get("cnpj") as string) || null,
    ie: (formData.get("ie") as string) || null,
    im: (formData.get("im") as string) || null,
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

export async function deleteSupplierAction(
  id: string,
): Promise<SupplierActionState> {
  const res = await deleteSupplier(id);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/contatos");
}
