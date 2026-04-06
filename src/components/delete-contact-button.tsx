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
import { Trash } from "lucide-react";

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
        className="mt-5 w-5 h-7 flex justify-center items-center rounded-full bg-red-500 disabled:opacity-50 cursor-pointer"
      >
        <Trash
          strokeWidth={1.5}
          size={15}
          className="text-white translate-y-px"
        />
      </button>
    </form>
  );
}
