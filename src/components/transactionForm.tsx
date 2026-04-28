"use client";

import { useActionState, useState } from "react";
import {
  submitTransactionFormAction,
  TransactionActionState,
} from "@/lib/api/actions/transaction";
import { Account } from "@/lib/api/bankAccounts";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { SelectInputField } from "./inputFieldSelect";
import { SearchableSelectInputField } from "./searchableSelectInputField";
import { InputField } from "./inputField";
import { buildCategoryGroups } from "@/lib/categoryGroups";
import { Contact } from "@/lib/api/contacts";

interface TransactionFormProps {
  type: string;
  accounts: Account[];
  categories: FinanceCategory[];
  contacts: Contact[];
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

  const contactOptions = contacts.map((c) => ({
    label:
      c.kind === "customer" ? c.name.toUpperCase() : c.legal_name.toUpperCase(),
    value: String(c.id),
  }));

  const error = state && "error" in state ? state.message : undefined;

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
            defaultValue={""}
            name="account"
            required
            options={accountOptions}
          />

          {type !== "transfer" && (
            <SelectInputField
              label="categoria"
              defaultValue={""}
              name="category"
              groups={buildCategoryGroups(categories)}
            />
          )}

          {type === "transfer" && (
            <SelectInputField
              label="Destino"
              defaultValue={""}
              name="send_to"
              required
              options={accountOptions}
            />
          )}
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-8">
          {type !== "transfer" && (
            <SearchableSelectInputField
              label="contato"
              defaultValue={""}
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
