import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type OrderStatus =
  | "draft"
  | "open"
  | "paid"
  | "cancelled"
  | "refunded"
  | "completed";

export type OrderPayment = {
  id: string;
  method: string;
  amount: string;
  due_at: string;
  finance_transaction: string | null;
};

export type OrderItem = {
  id: string;
  product: string;
  transaction: string | null;
  sku: string;
  quantity: number;
  unit: string;
  price: string;
  discount: string;
  total: string;
};

export type Order = {
  id: string;
  business: string;
  order_number: number;
  operation_type: string | null;
  customer: string;
  operator: string;
  category: string | null;
  subtotal: string;
  discount_amount: string | null;
  ipi_amount: string | null;
  icms_amount: string | null;
  total_amount: string;
  order_date: string;
  created_at: string;
  notes: string | null;
  status: OrderStatus;
  payments?: OrderPayment[];
  items?: OrderItem[];
};

type OrdersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { order: Order }[];
};

export const getOrders = cache(async (): Promise<Order[] | ApiError> => {
  const res = await apiFetch<OrdersResponse>("/orders", {
    method: "GET",
  });

  if ("error" in res) return res;
  return res.results.map((r) => r.order);
});

export const getOrderByID = cache(
  async (id: string): Promise<Order | ApiError> => {
    const res = await apiFetch<{ order: Order }>(`/orders/${id}`, {
      method: "GET",
    });

    if ("error" in res) return res;
    return res.order;
  },
);
