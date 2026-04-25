"use client";

import { useActionState } from "react";
import { InputField } from "./inputField";
import { InputTextareaField } from "./inputTextAreaField";
import { SelectInputField } from "./inputFieldSelect";
import { Order } from "@/lib/api/orders";
import { updateOrderAction, OrderActionState } from "@/lib/api/actions/orders";

export default function EditOrderForm({ id, order }: { id: string; order: Order }) {
  const [state, action, pending] = useActionState<OrderActionState, FormData>(
    updateOrderAction.bind(null, id),
    null,
  );

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      <div className="mb-8">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
          venda
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          <SelectInputField
            label="status"
            name="status"
            required
            defaultValue={order.status}
            options={[
              { label: "RASCUNHO", value: "draft" },
              { label: "ABERTA", value: "open" },
              { label: "PAGA", value: "paid" },
              { label: "CANCELADA", value: "cancelled" },
              { label: "ESTORNADA", value: "refunded" },
              { label: "CONCLUÍDA", value: "completed" },
            ]}
          />

          <InputField
            label="data da venda"
            name="order_date"
            type="date"
            defaultValue={order.order_date.split("T")[0]}
            required
          />

          <InputField
            label="desconto"
            name="discount_amount"
            defaultValue={order.discount_amount ?? ""}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
          observações
        </p>

        <InputTextareaField
          label=""
          name="notes"
          rows={3}
          defaultValue={order.notes ?? ""}
          className="w-full p-0 text-sm font-light bg-transparent border-b border-tertiary/30 placeholder:text-tertiary/50 outline-none focus:border-tertiary resize-none"
        />
      </div>

      <div className="mt-10 w-full">
        {error && (
          <p className="mb-2 text-xs font-light normal-case text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-5 py-1.5 text-sm border uppercase disabled:opacity-50 cursor-pointer"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
