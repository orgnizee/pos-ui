"use client";

import { useActionState, useState } from "react";
import {
  submitTransactionFormAction,
  TransactionActionState,
} from "@/lib/api/actions/transaction";
import { Account } from "@/lib/api/bank-accounts";
import { FinanceCategory } from "@/lib/api/finance-category";
import { Customer } from "@/lib/api/customers";

interface TransactionFormProps {
  type: string;
  accounts: Account[];
  categories: FinanceCategory[];
  customers: Customer[];
}

export default function TransactionForm({
  type,
  accounts,
  categories,
  customers,
}: TransactionFormProps) {
  const [state, action, pending] = useActionState<
    TransactionActionState,
    FormData
  >(submitTransactionFormAction, null);

  const [accountValue, setAccountValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [contactValue, setContactValue] = useState("");
  
  return (
    <form action={action} className="flex flex-col items-start">
      <input
        required
        readOnly
        name="type"
        value={type}
        type="text"
        className="hidden"
      />

      <p className="text-sm font-light normal-case">valor</p>
      <input
        required
        name="amount"
        type="number"
        placeholder="R$ 0,00"
        className="mt-1.5 text-start text-3xl normal-case outline-none"
      />

      <div className="mt-4 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <select
          required
          name="account"
          defaultValue=""
          className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
            accountValue === "" ? "text-tertiary" : "text-primary"
          }`}
          onChange={(e) => setAccountValue(e.target.value)}
        >
          <option value="" disabled>
            conta
          </option>
          {accounts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <select
          name="category"
          defaultValue=""
          className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
            categoryValue === "" ? "text-tertiary" : "text-primary"
          }`}
          onChange={(e) => setCategoryValue(e.target.value)}
        >
          <option value="" disabled>
            categoria
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <select
          name="contact"
          defaultValue=""
          className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
            contactValue === "" ? "text-tertiary" : "text-primary"
          }`}
          onChange={(e) => setContactValue(e.target.value)}
        >
          <option value="" disabled>
            contato
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <input
          required
          name="description"
          placeholder="descrição"
          type="text"
          className="w-full h-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-1 relative h-5 w-full max-w-xs">
        {state && "error" in state && (
          <p className="text-end text-xs font-light normal-case text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="relative w-14 px-2 py-0.5 rounded-md bg-black cursor-pointer">
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
