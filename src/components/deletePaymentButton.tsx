"use client";

import { useTransition } from "react";
import { Trash } from "lucide-react";
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
      className="mt-5 w-5 h-7 flex justify-center items-center rounded-full bg-red-500 disabled:opacity-50 cursor-pointer"
    >
      <Trash
        strokeWidth={1.5}
        size={15}
        className="text-white translate-y-px"
      />
    </button>
  );
}
