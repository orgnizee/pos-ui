"use client";
import { filterClass } from "@/lib/style-filter-buttons";
import { useRouter, useSearchParams } from "next/navigation";

export default function DropdownTypeMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("type") ?? "";

  const options = [
    { label: "entrada", value: "credit" },
    { label: "saída", value: "debit" },
    { label: "transferência", value: "transfer" },
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
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
      <option value="">tipo</option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
