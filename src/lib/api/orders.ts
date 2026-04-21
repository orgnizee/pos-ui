import { apiFetch } from "./client";
import { ApiError } from "./types";

export type OrderStatus =
  | "draft"
  | "open"
  | "paid"
  | "cancelled"
  | "refunded"
  | "completed";

export interface OrderItem {
  id: string;
  product: string; // product id
  product_name: string; // denormalized for display
  sku: string;
  quantity: number;
  unit: string;
  price: string; // decimal string from DRF
  discount: string;
  total: string;
}

export interface OrderPayment {
  id: string;
  method: string; // PaymentMethod id
  method_name: string; // denormalized for display
  destination: "receivable" | "finance_account";
  finance_account: string | null;
  amount: string;
  due_at: string; // ISO datetime
}

export interface Order {
  id: string;
  order_number: number;
  status: OrderStatus;
  operation_type: string | null;
  customer: string;
  customer_name: string;
  operator: string;
  operator_name: string;
  category: string | null;
  category_name: string | null;
  subtotal: string;
  discount_amount: string;
  ipi_amount: string;
  icms_amount: string;
  total_amount: string;
  order_date: string; // ISO date
  created_at: string; // ISO datetime
  notes: string | null;
  items: OrderItem[];
  payments: OrderPayment[];
}

export type OrderListItem = Pick<
  Order,
  | "id"
  | "order_number"
  | "status"
  | "customer_name"
  | "operator_name"
  | "total_amount"
  | "order_date"
  | "created_at"
>;

export interface PaginatedOrders {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrderListItem[];
}

export interface OrderFilters {
  status?: OrderStatus;
  date_after?: string;
  date_before?: string;
  customer?: string;
  page?: string;
}

// ─── Payload types (create / update) ─────────────────────────────────────────

export interface OrderItemPayload {
  product: string;
  sku: string;
  quantity: number;
  unit: string;
  price: string;
  discount: string;
  total: string;
}

export interface OrderPaymentPayload {
  method: string;
  amount: string;
  due_at: string;
}

export interface OrderPayload {
  customer: string;
  category?: string;
  operation_type?: string;
  order_date: string;
  notes?: string;
  subtotal: string;
  discount_amount: string;
  ipi_amount: string;
  icms_amount: string;
  total_amount: string;
  items: OrderItemPayload[];
  payments: OrderPaymentPayload[];
}

export async function getOrders(
  filters: OrderFilters = {},
): Promise<PaginatedOrders | ApiError> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.date_after) params.set("order_date_after", filters.date_after);
  if (filters.date_before) params.set("order_date_before", filters.date_before);
  if (filters.customer) params.set("customer", filters.customer);
  if (filters.page) params.set("page", filters.page);

  const qs = params.toString();
  const res = apiFetch<PaginatedOrders>(`/orders?${qs ? `?${qs}` : ""}`);

  console.log(res);

  if ("error" in res) return res;
  return res;
}

export async function getOrder(id: string): Promise<Order | ApiError> {
  const res = await apiFetch<Order>(`/orders/${id}`, {
    method: "GET",
  });
  if ("error" in res) return res;

  return res;
}
