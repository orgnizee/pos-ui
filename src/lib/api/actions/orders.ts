"use server";

import { redirect } from "next/navigation";
import { createOrder, deleteOrder, OrderStatus, updateOrder } from "../orders";
import { isApiError } from "../types";

export type OrderActionState = {
  error: true;
  message: string;
  details?: unknown;
} | null;

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
    category: formData.get("category") as string,
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

  redirect(`/vendas/${res.id}?print`);
}

export async function updateOrderAction(
  id: string,
  _: unknown,
  formData: FormData,
): Promise<OrderActionState> {
  const itemsRaw = formData.get("items") as string | null;
  const paymentMethodsRaw = formData.get("payment_methods") as string | null;

  let parsedItems:
    | {
        id?: string;
        product: string;
        quantity: number;
        price: string;
        discount: string;
      }[]
    | undefined;
  let parsedPaymentMethods:
    | {
        id?: string;
        method: string;
        amount: string;
        due_at: string;
      }[]
    | undefined;

  if (itemsRaw) {
    try {
      parsedItems = JSON.parse(itemsRaw) as {
        id?: string;
        product: string;
        quantity: number;
        price: string;
        discount: string;
      }[];
    } catch {
      return { error: true, message: "itens inválidos." };
    }
  }

  if (paymentMethodsRaw) {
    try {
      parsedPaymentMethods = JSON.parse(paymentMethodsRaw) as {
        id?: string;
        method: string;
        amount: string;
        due_at: string;
      }[];
    } catch {
      return { error: true, message: "pagamentos inválidos." };
    }
  }

  const res = await updateOrder(id, {
    items: parsedItems,
    payment_methods: parsedPaymentMethods,
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
    return {
      error: true,
      message: "venda possui contas recebidas",
      details: res.details,
    };
  }

  redirect("/vendas");
}
