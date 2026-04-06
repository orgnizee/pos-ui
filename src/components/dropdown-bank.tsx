"use client";
import { filterClass } from "@/app/(private)/caixa/filter-class";
import { Account } from "@/lib/api/bank-accounts";
import { useRouter, useSearchParams } from "next/navigation";

export default function DropdownBankAccountMenu({
  accounts,
}: {
  accounts: Account[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("bank") ?? "";

  const options = [
    ...accounts.map((a) => ({ label: a.name.toLowerCase(), value: a.id })),
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("bank", value);
    } else {
      params.delete("bank");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      style={{ textAlignLast: "center" }}
      className={filterClass(current !== "")}
    >
      <option value="">
        conta
      </option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
