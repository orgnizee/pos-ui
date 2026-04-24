"use client";

import { useActionState } from "react";
import {
  BankAccountActionState,
  submitBankAccountFormAction,
  submitUpdateBankAccountFormAction,
} from "@/lib/api/actions/bank-accounts";
import { Account } from "@/lib/api/bankAccounts";
import { InputField } from "./inputField";

export default function BankAccountForm() {
  const [state, action, pending] = useActionState<
    BankAccountActionState,
    FormData
  >(submitBankAccountFormAction, null);

  return (
    <form
      action={action}
      className="flex flex-col items-start min-w-lg"
      autoComplete="off"
    >
      <InputField label="conta" name="bank" type="text" />

      <div className="mt-1 relative h-5 w-full max-w-xl">
        {state && "error" in state && (
          <p className="text-end text-xs font-light normal-case text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="w-full h-fit py-1 border cursor-pointer">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center w-full text-sm cursor-pointer uppercase"
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
      className="flex flex-col items-start w-full"
      autoComplete="off"
    >
      <p className="mb-4 font-light">atualizar dados da conta</p>

      <InputField
        label="conta"
        name="bank"
        defaultValue={account.name.toUpperCase()}
        type="text"
      />

      <label className="mt-4 flex items-center gap-2 text-sm font-light cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={!account.is_active}
          className="appearance-none w-4 h-4 border border-primary rounded-none cursor-pointer relative checked:bg-primary checked:border-primary checked:after:content-[''] checked:after:absolute checked:after:top-0.5 checked:after:left-1.25 checked:after:w-1 checked:after:h-2 checked:after:border checked:after:border-white checked:after:border-t-0 checked:after:border-l-0 checked:after:rotate-45"
        />
        ocultar conta
      </label>

      <div className="mt-1 relative h-5 w-full max-w-xs">
        {state && "error" in state && (
          <p className="text-end text-xs font-light text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="w-full h-fit py-1 border cursor-pointer">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center w-full text-sm cursor-pointer uppercase"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
