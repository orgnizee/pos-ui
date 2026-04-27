"use client";

import { useActionState } from "react";
import {
  deleteProductAction,
  ProductActionState,
} from "@/lib/api/actions/products";

export default function DeleteProductButton({ id }: { id: string }) {
  const action = deleteProductAction.bind(null, id);
  const [, dispatch, pending] = useActionState<ProductActionState, FormData>(
    action,
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
