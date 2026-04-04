"use client";

import { useActionState } from "react";
import {
  BankAccountActionState,
  submitBankAccountFormAction,
  submitUpdateBankAccountFormAction,
} from "@/lib/api/actions/bank-accounts";
import { Account } from "@/lib/api/bank-accounts";

export default function BankAccountForm() {
  const [state, action, pending] = useActionState<
    BankAccountActionState,
    FormData
  >(submitBankAccountFormAction, null);

  return (
    <form
      action={action}
      className="flex flex-col items-start"
      autoComplete="off"
    >
      <div className="mt-2 w-75 h-10 text-sm font-light rounded-md bg-background">
        <input
          required
          name="bank"
          placeholder="conta"
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

export function UpdateBankAccountForm({ account }: { account: Account }) {
  const boundAction = submitUpdateBankAccountFormAction.bind(null, account.id);

  const [state, action, pending] = useActionState<
    BankAccountActionState,
    FormData
  >(boundAction, null);

  return (
    <form
      action={action}
      className="flex flex-col items-start"
      autoComplete="off"
    >
      <p className="normal-case font-light">atualizar dados da conta</p>

      <div className="mt-2 w-75 h-10 text-sm font-light rounded-md bg-background">
        <input
          name="bank"
          defaultValue={account.name.toLowerCase()}
          placeholder={account.name.toLowerCase()}
          type="text"
          className="w-full h-full p-2 placeholder:text-tertiary outline-none focus:border focus:border-tertiary focus:rounded-md"
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm normal-case font-light cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={!account.is_active}
        />
        ocultar conta
      </label>

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
