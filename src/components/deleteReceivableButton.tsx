"use client";

import { useActionState } from "react";
import {
  deleteReceivableAction,
  ReceivableActionState,
} from "@/lib/api/actions/receivables";

export default function DeletePaymentButton({ id }: { id: string }) {
  const [state, dispatch, pending] = useActionState<
    ReceivableActionState,
    FormData
  >(deleteReceivableAction.bind(null, id), null);

  return (
    <form action={dispatch}>
      <button
        type="submit"
        disabled={pending}
        className="no-print mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
      >
        excluir
      </button>
      <p className="text-xs text-red-500 ml-1">{state?.message}</p>
    </form>
  );
}
