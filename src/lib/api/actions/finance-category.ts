"use server";

import { redirect } from "next/navigation";
import { isApiError } from "@/lib/api/types";
import { createFinanceCategory } from "../finance-category";

export type FinanceCategoryActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

export async function submitFinanceCategoryFormAction(
  _: unknown,
  formData: FormData,
): Promise<FinanceCategoryActionState> {
  const res = await createFinanceCategory({
    name: formData.get("category") as string,
    parent: formData.get("tipo") as string,
    is_active: true,
  });

  console.log(res);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/financeiro/categorias");
}
