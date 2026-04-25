"use server";

import { redirect } from "next/navigation";
import { createOrder, deleteOrder, OrderStatus, updateOrder } from "../orders";
import { isApiError } from "../types";

export type OrderActionState =
  | {
      error: true;
      message: string;
      details?: unknown;
    }
  | null;

export async function createOrderAction(
  _: unknown,
  formData: FormData,
): Promise<OrderActionState> {
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
}

export async function updateOrderAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<OrderActionState> {
  const res = await updateOrder(id, {
    status: (formData.get("status") as OrderStatus) || undefined,
    order_date: (formData.get("order_date") as string) || undefined,
    discount_amount: (formData.get("discount_amount") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect(`/vendas/${id}`);
}

export async function deleteOrderAction(id: string): Promise<OrderActionState> {
  const res = await deleteOrder(id);

  if (isApiError(res)) {
    return { error: true, message: res.message, details: res.details };
  }

  redirect("/vendas");
}
