import { Product } from "@/lib/api/products";

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  discountCents: number;
};

export type PaymentEntry = {
  method: string;
  amount: string;
  due_at: string;
};

export type CustomerOption = {
  id: string | null;
  name: string;
};
