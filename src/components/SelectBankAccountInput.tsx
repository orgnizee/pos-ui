"use client";
import { filterClass } from "@/lib/styleFilterButtons";
import { Account } from "@/lib/api/bankAccounts";
import { useRouter, useSearchParams } from "next/navigation";

export default function SelectBankAccountInput({
  accounts,
}: {
  accounts: Account[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("bank") ?? "";

  const options = [
    ...accounts.map((a) => ({ label: a.name.toUpperCase(), value: a.id })),
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("bank", value);
    } else {
      params.delete("bank");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      style={{ textAlignLast: "end" }}
      className={`${filterClass(current !== "")}`}
    >
      <option disabled value="">
        CONTA
      </option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
