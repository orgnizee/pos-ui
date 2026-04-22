"use client";

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

  const [, dispatch, pending] = useActionState<
    CustomerActionState | SupplierActionState,
    FormData
  >(action, null);

  return (
    <form action={dispatch}>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
      >
        excluir
      </button>
    </form>
  );
}
