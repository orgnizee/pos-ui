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

export type OrderContact = {
  id: string;
  name: string;
};

export type OrderPaymentMethod = {
  id: string;
  method: {
    id: string;
    description: string;
  };
  amount: string;
  due_at: string;
  finance_transaction: string | null;
};

export type OrderItem = {
  id: string;
  product: {
    id: string;
    name: string;
  };
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
  items: OrderItem[];
  payment_methods: OrderPaymentMethod[];
  order_number: number;
  operation_type: string | null;
  subtotal: string;
  discount_amount: string | null;
  ipi_amount: string | null;
  icms_amount: string | null;
  total_amount: string;
  order_date: string;
  created_at: string;
  notes: string | null;
  status: OrderStatus;
  customer: OrderContact;
  operator: OrderContact;
  category: {
    id: string;
    name: string;
  } | null;
};

export type CreateOrderInput = {
  items: {
    product: string;
    quantity: number;
    price: string;
    discount: string;
  }[];
  customer: string;
  payment_methods: {
    method: string;
    amount: string;
    due_at: string;
  }[];
  discount_amount?: string;
  order_date: string;
  notes?: string;
  status: OrderStatus;
  category?: string | null;
};

export type UpdateOrderInput = {
  items?: {
    id?: string;
    product: string;
    quantity: number;
    price: string;
    discount: string;
  }[];
  customer?: string;
  payment_methods?: {
    id?: string;
    method: string;
    amount: string;
    due_at: string;
  }[];
  discount_amount?: string;
  order_date?: string;
  notes?: string;
  status?: OrderStatus;
  category?: string | null;
};

type OrdersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
};

export const getOrders = cache(async (): Promise<Order[] | ApiError> => {
  const res = await apiFetch<OrdersResponse>("/orders", {
    method: "GET",
  });

  if ("error" in res) return res;
  return res.results;
});

export const getOrderByID = cache(
  async (id: string): Promise<Order | ApiError> => {
    return apiFetch<Order>(`/orders/${id}`, {
      method: "GET",
    });
  },
);

export async function createOrder(
  data: CreateOrderInput,
): Promise<Order | ApiError> {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrder(
  id: string,
  data: UpdateOrderInput,
): Promise<Order | ApiError> {
  return apiFetch(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOrder(id: string): Promise<void | ApiError> {
  return apiFetch(`/orders/${id}`, { method: "DELETE" });
}
