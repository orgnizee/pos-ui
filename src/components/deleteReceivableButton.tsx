"use client";

import { useTransition } from "react";
import { deleteReceivableAction } from "@/lib/api/actions/receivables";


export default function DeletePaymentButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteReceivableAction(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
        className="mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
    >
      excluir
    </button>
  );
}
