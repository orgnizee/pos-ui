"use client";

import { useActionState } from "react";
import { getTokenAction, TokenActionState } from "@/lib/api/actions/auth";

interface TransactionFormProps {
  type: string;
}

export default function TransactionForm({ type }: TransactionFormProps) {
  const [state, action, pending] = useActionState<TokenActionState, FormData>(
    getTokenAction,
    null,
  );

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

      <div className="mt-4 w-full max-w-xs h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="account"
          placeholder="conta"
          type="text"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-2 w-full max-w-xs h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="category"
          placeholder="categoria"
          type="text"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-2 w-full max-w-xs h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="contact"
          placeholder="contato"
          type="text"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <div className="mt-2 w-full max-w-xs h-fit text-sm font-light rounded-md bg-background">
        <input
          required
          name="description"
          placeholder="descrição"
          type="text"
          className="w-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
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
