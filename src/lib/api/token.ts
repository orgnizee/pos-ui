import { apiFetch } from "./client"
import { ApiError } from "./types"

type Token = {
  access: string
  refresh: string
}

export async function getToken(data: {
  username: string
  password: string
}): Promise<Token | ApiError> {
  return apiFetch("/token", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
