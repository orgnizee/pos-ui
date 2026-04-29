import { apiFetch } from "./client";
import { ApiError } from "./types";

export type SettlePayableData = {
  amount: string;
  account: string;
};

export type SettlePayableResponse = {
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
  data: SettlePayableData,
): Promise<SettlePayableResponse | ApiError> {
  return apiFetch(`/payables/${id}/settle`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
