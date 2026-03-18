import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
  groups: string[];
  user_permissions: string[];
};

type UserResponse = {
  user: User;
};

export const getUser = cache(async (): Promise<User | ApiError> => {
  const res = await apiFetch<UserResponse>("/me", {
    method: "GET",
  });

  if ("error" in res) return res;

  return res.user;
});
