"use client";

import { useActionState } from "react";
import { deleteOrderAction, OrderActionState } from "@/lib/api/actions/orders";

export default function DeleteOrderButton({ id }: { id: string }) {
  const [, dispatch, pending] = useActionState<OrderActionState, FormData>(
    deleteOrderAction.bind(null, id),
    null,
  );

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
