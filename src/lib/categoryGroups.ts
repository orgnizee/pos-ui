import { OptionGroup } from "@/components/inputFieldSelect";
import { FinanceCategory } from "@/lib/api/financeCategory";

export function buildCategoryGroups(categories: FinanceCategory[]): OptionGroup[] {
  const receitas = categories.find((c) => c.name.toLowerCase() === "receitas");

  const despesas = categories.find((c) => c.name.toLowerCase() === "despesas");

  return [
    receitas && {
      label: "RECEITAS",
      options: categories
        .filter((c) => c.parent?.id === receitas.id)
        .map((c) => ({
          label: c.name.toUpperCase(),
          value: String(c.id),
        })),
    },

    despesas && {
      label: "DESPESAS",
      options: categories
        .filter((c) => c.parent?.id === despesas.id)
        .map((c) => ({
          label: c.name.toUpperCase(),
          value: String(c.id),
        })),
    },
  ].filter(Boolean) as OptionGroup[];
}
