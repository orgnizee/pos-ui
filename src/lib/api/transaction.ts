import { apiFetch } from "./client"
import { ApiError } from "./types"

export type Transaction = {
  id: string
  type: string
  category: string
  operator: string
  account: string
  contact: string
  payment: string
  linked: string
  amount: number
  description: string
  timestamp: string
}

export async function submitTransaction(data: {
  type: string
  category: string
  account: string
  contact: string
  amount: string
  description: string
}): Promise<Transaction | ApiError> {
  return apiFetch("/finance/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
