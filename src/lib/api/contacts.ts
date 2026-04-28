import { cache } from "react";
import { apiFetch } from "./client";
import { ApiError } from "./types";
import { Customer } from "./customers";
import { Supplier } from "./suppliers";

export type Contact =
  | ({ kind: "customer" } & Customer)
  | ({ kind: "supplier" } & Supplier);

export type ContactsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ({ customer: Customer } | { supplier: Supplier })[];
};

function parseContacts(results: ContactsResponse["results"]): Contact[] {
  return results.map((r) => {
    if ("customer" in r) return { kind: "customer", ...r.customer };
    return { kind: "supplier", ...r.supplier };
  });
}

export const getContacts = cache(
  async (page: number = 1): Promise<Contact[] | ApiError> => {
    const params = new URLSearchParams({
      page: String(page),
    });

    const res = await apiFetch<ContactsResponse>(
      `/contacts?${params.toString()}`,
      {
        method: "GET",
      },
    );

    if ("error" in res) return res;
    return parseContacts(res.results);
  },
);

export const getAllContacts = cache(async (): Promise<Contact[] | ApiError> => {
  const allContacts: Contact[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      page: String(page),
    });

    const res = await apiFetch<ContactsResponse>(
      `/contacts?${params.toString()}`,
      {
        method: "GET",
      },
    );

    if ("error" in res) return res;

    allContacts.push(...parseContacts(res.results));

    if (!res.next) break;
    page += 1;
  }

  return allContacts.sort((a, b) => {
    const aName = a.kind === "customer" ? a.name : a.legal_name;
    const bName = b.kind === "customer" ? b.name : b.legal_name;
    return aName.localeCompare(bName);
  });
});

export async function getContactsPage({
  page = 1,
  search,
}: {
  page?: number;
  search?: string;
}): Promise<{ count: number; results: Contact[] } | ApiError> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (search) {
    params.set("search", search);
  }

  const res = await apiFetch<ContactsResponse>(
    `/contacts?${params.toString()}`,
    { method: "GET" },
  );

  if ("error" in res) return res;

  return {
    count: res.count,
    results: parseContacts(res.results),
  };
}

export async function searchContacts(
  search: string,
): Promise<Contact[] | ApiError> {
  const params = new URLSearchParams({ search });
  const res = await apiFetch<ContactsResponse>(
    `/contacts?${params.toString()}`,
    { method: "GET" },
  );
  if ("error" in res) return res;
  return parseContacts(res.results);
}
