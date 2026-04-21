"use server";

import { apiFetch } from "@/lib/api/client";
import { isApiError } from "@/lib/api/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderPayload, OrderStatus } from "@/lib/api/orders";

export type OrderFormState = {
  errors: Record<string, string[]>;
  message: string | null;
};

// const initialState: OrderFormState = { errors: {}, message: null };

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createOrderAction(
  payload: OrderPayload
): Promise<OrderFormState> {
  try {
    await apiFetch("/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (isApiError(err)) {
      return { errors: {}, message: err.message };
    }
    return { errors: {}, message: "Erro inesperado ao criar pedido." };
  }

  revalidatePath("/orders");
  redirect("/orders");
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateOrderAction(
  id: string,
  payload: OrderPayload
): Promise<OrderFormState> {
  try {
    await apiFetch(`/orders/${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (isApiError(err)) {
      return { errors: {}, message: err.message };
    }
    return { errors: {}, message: "Erro inesperado ao atualizar pedido." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  redirect(`/orders/${id}`);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteOrderAction(id: string): Promise<void> {
  await apiFetch(`/orders/${id}/`, { method: "DELETE" });
  revalidatePath("/orders");
  redirect("/orders");
}

// ─── Status change ────────────────────────────────────────────────────────────

export async function changeOrderStatusAction(
  id: string,
  status: OrderStatus
): Promise<OrderFormState> {
  try {
    await apiFetch(`/orders/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    if (isApiError(err)) {
      return { errors: {}, message: err.message };
    }
    return { errors: {}, message: "Erro ao atualizar status." };
  }

  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
  return { errors: {}, message: null };
}
