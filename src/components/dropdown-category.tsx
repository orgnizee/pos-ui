"use client";
import { filterClass } from "@/app/(private)/caixa/filter-class";
import { FinanceCategory } from "@/lib/api/finance-category";
import { useRouter, useSearchParams } from "next/navigation";

export default function DropdownCategoryMenu({
  categories,
}: {
  categories: FinanceCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  const options = categories
    .filter(
      (c) =>
        c.is_active && !["receitas", "despesas"].includes(c.name.toLowerCase()),
    )
    .map((c) => ({ label: c.name, value: c.id }));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
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
      <option value="" disabled>
        categoria
      </option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
