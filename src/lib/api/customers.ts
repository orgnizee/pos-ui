import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";

export type Customer = {
  id: string;
  name: string;
};

type CustomersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { customer: Customer }[];
};

export const getCustomers = cache(
  async (): Promise<Customer[] | ApiError> => {
    const res = await apiFetch<CustomersResponse>("/contacts/customers", {
      method: "GET",
    });

    if ("error" in res) return res;

    return res.results.map((r) => r.customer);
  },
);
