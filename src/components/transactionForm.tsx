"use client";

import { useActionState, useState } from "react";
import {
  submitTransactionFormAction,
  TransactionActionState,
} from "@/lib/api/actions/transaction";
import { Account } from "@/lib/api/bankAccounts";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { Customer } from "@/lib/api/customers";
import { Supplier } from "@/lib/api/suppliers";
import { OptionGroup, SelectInputField } from "./inputFieldSelect";
import { InputField } from "./inputField";

interface TransactionFormProps {
  type: string;
  accounts: Account[];
  categories: FinanceCategory[];
  contacts: Customer[] | Supplier[];
}

export default function TransactionForm({
  type,
  accounts,
  categories,
  contacts,
}: TransactionFormProps) {
  const [state, action, pending] = useActionState<
    TransactionActionState,
    FormData
  >(submitTransactionFormAction, null);

  const [cents, setCents] = useState(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setCents(Number(digits));
  };

  const displayValue = (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const accountOptions = accounts.map((a) => ({
    label: a.name.toUpperCase(),
    value: String(a.id),
  }));

  const receitas = categories.find((c) => c.name.toLowerCase() === "receitas");
  const despesas = categories.find((c) => c.name.toLowerCase() === "despesas");

  const categoryGroups = [
    receitas && {
      label: "RECEITAS",
      options: categories
        .filter((c) => c.parent?.id === receitas.id)
        .map((c) => ({ label: c.name.toUpperCase(), value: String(c.id) })),
    },
    despesas && {
      label: "DESPESAS",
      options: categories
        .filter((c) => c.parent?.id === despesas.id)
        .map((c) => ({ label: c.name.toUpperCase(), value: String(c.id) })),
    },
  ].filter(Boolean) as OptionGroup[];

  const contactOptions = contacts.map((c) => ({
    label: isCustomer(c) ? c.name : c.legal_name,
    value: String(c.id),
  }));

  const error = state && "error" in state ? state.message : undefined;

  function isCustomer(c: Customer | Supplier): c is Customer {
    return "name" in c;
  }

  return (
    <form action={action} className="w-full max-w-xl mt-12">
      <input type="hidden" name="type" value={type} readOnly />
      <input type="hidden" name="amount" value={(cents / 100).toFixed(2)} />

      {/* Amount — full width header */}
      <div className="mb-8">
        <InputField
          label="valor"
          required
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleAmountChange}
          autoFocus
        />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-x-8">
        {/* Left col */}
        <div className="flex flex-col gap-8">
          <SelectInputField
            label={type === "transfer" ? "Origem" : "Conta"}
            name="account"
            required
            options={accountOptions}
          />

          {type !== "transfer" && (
            <SelectInputField
              label="categoria"
              name="category"
              groups={categoryGroups}
            />
          )}

          {type === "transfer" && (
            <SelectInputField
              label="Destino"
              name="send_to"
              required
              options={accountOptions}
            />
          )}
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-8">
          {type !== "transfer" && (
            <SelectInputField
              label="Contato"
              name="contact"
              options={contactOptions}
            />
          )}

          <InputField
            label="Descrição"
            name="description"
            required
            error={error}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-10 w-full">
        <button
          type="submit"
          disabled={pending}
          className="w-full px-5 py-1.5 text-sm border uppercase disabled:opacity-50 cursor-pointer"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
