"use client";

import { useTransition } from "react";
import { deleteTransactionAction } from "@/lib/api/actions/transaction";

export default function DeleteTransactionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteTransactionAction(null, id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="mt-3 flex justify-start items-center cursor-pointer uppercase text-xs"
    >
      excluir
    </button>
  );
}
