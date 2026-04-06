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

  const receitas = categories.find((c) => c.name.toLowerCase() === "receitas");
  const despesas = categories.find((c) => c.name.toLowerCase() === "despesas");

  const children = (parentId: string) =>
    categories
      .filter((c) => c.is_active && c.parent?.id === parentId)
      .map((c) => ({ label: c.name.toLowerCase(), value: c.id }));

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
      <option value="">
        categoria
      </option>
      {receitas && (
        <optgroup label="receitas">
          {children(receitas.id).map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </optgroup>
      )}
      {despesas && (
        <optgroup label="despesas">
          {children(despesas.id).map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
