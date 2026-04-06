"use client";

import { Trash2 } from "lucide-react";
import {
  deleteCustomerAction,
  CustomerActionState,
} from "@/lib/api/actions/customer";
import {
  deleteSupplierAction,
  SupplierActionState,
} from "@/lib/api/actions/supplier";
import { useActionState } from "react";

export default function DeleteContactButton({
  id,
  kind,
}: {
  id: string;
  kind: "customer" | "supplier";
}) {
  const action =
    kind === "customer"
      ? deleteCustomerAction.bind(null, id)
      : deleteSupplierAction.bind(null, id);

  const [state, dispatch, pending] = useActionState<
    CustomerActionState | SupplierActionState,
    FormData
  >(action, null);

  return (
    <form action={dispatch}>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md bg-red-500/10 text-red-500 text-sm font-light normal-case disabled:opacity-50"
      >
        <Trash2 size={13} />
        excluir
      </button>

      {state && "error" in state && (
        <p className="mt-1 text-xs text-red-500 font-light">{state.message}</p>
      )}
    </form>
  );
}
