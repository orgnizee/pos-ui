"use client";

import { useActionState, useState } from "react";
import {
  FinanceCategoryActionState,
  submitFinanceCategoryFormAction,
} from "@/lib/api/actions/finance-category";
import { FinanceCategory } from "@/lib/api/financeCategory";

export default function CreateFinanceCategoryForm({
  categories,
}: {
  categories: FinanceCategory[];
}) {
  const [value, setValue] = useState("");
  const parentCategories = categories.filter((c) =>
    ["receitas", "despesas"].includes(c.name.toLowerCase()),
  );

  const [state, action, pending] = useActionState<
    FinanceCategoryActionState,
    FormData
  >(submitFinanceCategoryFormAction, null);

  return (
    <form
      action={action}
      className="flex flex-col items-start"
      autoComplete="off"
    >
      <div className="mt-2 w-75 h-10 text-sm font-light rounded-md bg-background">
        <input
          name="category"
          placeholder="categoria"
          type="text"
          className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <select
          required
          name="tipo"
          defaultValue=""
          className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
            value === "" ? "text-tertiary/75" : "text-black"
          }`}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="" disabled>
            tipo
          </option>
          {parentCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-1 relative h-5 w-full max-w-xs">
        {state && "error" in state && (
          <p className="text-end text-xs font-light normal-case text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="w-14 px-2 py-0.5 rounded-md bg-black cursor-pointer">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center w-full text-sm text-white cursor-pointer"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
