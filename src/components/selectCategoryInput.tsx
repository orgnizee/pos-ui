"use client";
import { filterClass } from "@/lib/styleFilterButtons";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { useRouter, useSearchParams } from "next/navigation";

export default function SelectCategoryInput({
  categories,
}: {
  categories: FinanceCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  const receitas = categories.find((c) => c.name === "receitas");
  const despesas = categories.find((c) => c.name === "despesas");

  const children = (parentId: string) =>
    categories
      .filter((c) => c.is_active && c.parent?.id === parentId)
      .map((c) => ({ label: c.name, value: c.id }));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`, {scroll: false});
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      style={{ textAlignLast: "end" }}
      className={`${filterClass(current !== "")}`}
    >
      <option disabled value="">
        CATEGORIA
      </option>
      {receitas && (
        <optgroup label="RECEITAS">
          {children(receitas.id).map(({ label, value }) => (
            <option key={value} value={value} className="uppercase">
              {label.toUpperCase()}
            </option>
          ))}
        </optgroup>
      )}
      {despesas && (
        <optgroup label="DESPESAS">
          {children(despesas.id).map(({ label, value }) => (
            <option key={value} value={value} className="uppercase">
              {label.toUpperCase()}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
