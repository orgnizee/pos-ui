import { apiFetch } from "./client";
import { ApiError } from "./types";

export type SettleReceivableData = {
  amount: string;
  account: string;
};

export type SettleReceivableResponse = {
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

export async function settleReceivable(
  id: string,
  data: SettleReceivableData,
): Promise<SettleReceivableResponse | ApiError> {
  return apiFetch(`/receivables/${id}/settle`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
