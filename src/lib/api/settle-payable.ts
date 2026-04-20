import { apiFetch } from "./client";
import { ApiError } from "./types";

export type SettlePaymentData = {
  amount: string;
  account: string;
};

export type SettlePaymentResponse = {
  transaction: {
    id: string;
    amount: string;
    account: { id: string; name: string };
    category: { id: string | null; name: string | null };
    contact: { id: string | null; name: string | null };
    operator: { id: string | null; name: string | null };
    description: string;
    type: string;
    timestamp: string;
  };
};

export async function settlePayable(
  id: string,
  data: SettlePaymentData,
): Promise<SettlePaymentResponse | ApiError> {
  return apiFetch(`/payables/${id}/settle`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
