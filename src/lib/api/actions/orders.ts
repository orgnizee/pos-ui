"use server";

<<<<<<< HEAD
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
=======
import { redirect } from "next/navigation";
import { createOrder, OrderStatus } from "../orders";
import { isApiError } from "../types";

export type CreateOrderActionState =
  | {
      error: true;
      message: string;
      details?: unknown;
    }
  | {
      error: false;
      message: string;
    }
  | null;

export async function createOrderAction(
  _: unknown,
  formData: FormData,
): Promise<CreateOrderActionState> {
  const itemsRaw = formData.get("items") as string;
  const paymentMethodsRaw = formData.get("payment_methods") as string;

  if (!itemsRaw || !paymentMethodsRaw) {
    return { error: true, message: "dados do pedido inválidos." };
  }

  const res = await createOrder({
    customer: formData.get("customer") as string,
    items: JSON.parse(itemsRaw) as {
      product: string;
      quantity: number;
      price: string;
      discount: string;
    }[],
    payment_methods: JSON.parse(paymentMethodsRaw) as {
      method: string;
      amount: string;
      due_at: string;
    }[],
    discount_amount: (formData.get("discount_amount") as string) || undefined,
    order_date: formData.get("order_date") as string,
    notes: (formData.get("notes") as string) || undefined,
    status: formData.get("status") as OrderStatus,
  });

  if (isApiError(res)) {
    return {
      error: true,
      message: res.message,
      details: res.details,
    };
  }

  redirect("/pdv");
>>>>>>> new
}
