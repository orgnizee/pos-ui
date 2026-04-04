"use client";

import { useActionState, useState } from "react";
import {
  submitTransactionFormAction,
  TransactionActionState,
} from "@/lib/api/actions/transaction";
import { Account } from "@/lib/api/bank-accounts";
import { FinanceCategory } from "@/lib/api/finance-category";
import { Customer } from "@/lib/api/customers";
import { Supplier } from "@/lib/api/suppliers";

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

  const [accountValue, setAccountValue] = useState("");
  const [sendToValue, setsendToValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [contactValue, setContactValue] = useState("");

  const [cents, setCents] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setCents(Number(digits));
  };

  const displayValue = (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  function isCustomer(c: Customer | Supplier): c is Customer {
    return "name" in c;
  }

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
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className="mt-1.5 text-start text-3xl normal-case outline-none"
      />
      {/* Hidden input carries the real numeric value for form submission */}
      <input type="hidden" name="amount" value={(cents / 100).toFixed(2)} />

      <div className="mt-4 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <select
          required
          name="account"
          defaultValue=""
          className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
            accountValue === "" ? "text-tertiary/75" : "text-black"
          }`}
          onChange={(e) => setAccountValue(e.target.value)}
        >
          <option value="" disabled>
            {type !== "transfer" && "conta"}
            {type === "transfer" && "origem"}
          </option>
          {accounts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {type === "transfer" && (
        <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
          <select
            required
            name="send_to"
            defaultValue=""
            className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
              sendToValue === "" ? "text-tertiary/75" : "text-black"
            }`}
            onChange={(e) => setsendToValue(e.target.value)}
          >
            <option value="" disabled>
              destino
            </option>
            {accounts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.toLocaleLowerCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {type !== "transfer" && (
        <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
          <select
            name="category"
            defaultValue=""
            className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
              categoryValue === "" ? "text-tertiary/75" : "text-black"
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
      )}

      {type !== "transfer" && (
        <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
          <select
            name="contact"
            defaultValue=""
            className={`w-full h-full p-2 outline-none focus:border focus:border-tertiary focus:rounded-md ${
              contactValue === "" ? "text-tertiary/75" : "text-black"
            }`}
            onChange={(e) => setContactValue(e.target.value)}
          >
            <option value="" disabled>
              contato
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {isCustomer(c)
                  ? c.name.toLocaleLowerCase()
                  : c.legal_name.toLocaleLowerCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-2 w-full max-w-xs h-10 text-sm font-light rounded-md bg-background">
        <input
          required
          name="description"
          placeholder="descrição"
          type="text"
          className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
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
