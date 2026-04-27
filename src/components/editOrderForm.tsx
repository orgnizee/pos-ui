"use client";

import { useActionState, useMemo, useState } from "react";
import { InputField } from "./inputField";
import { InputTextareaField } from "./inputTextAreaField";
import { SelectInputField } from "./inputFieldSelect";
import { Order } from "@/lib/api/orders";
import { updateOrderAction, OrderActionState } from "@/lib/api/actions/orders";

export default function EditOrderForm({ id, order }: { id: string; order: Order }) {
  const [items, setItems] = useState(
    order.items.map((item) => ({
      id: item.id,
      product: item.product.id,
      product_name: item.product.name,
      quantity: String(item.quantity),
      price: item.price,
      discount: item.discount,
    })),
  );
  const [payments, setPayments] = useState(
    order.payment_methods.map((method) => ({
      id: method.id,
      method: method.method.id,
      method_description: method.method.description,
      amount: method.amount,
      due_at: method.due_at.split("T")[0],
    })),
  );

  const [state, action, pending] = useActionState<OrderActionState, FormData>(
    updateOrderAction.bind(null, id),
    null,
  );

  const error = state && "error" in state ? state.message : undefined;
  const itemsPayload = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity || 0),
          price: item.price || "0",
          discount: item.discount || "0",
        })),
      ),
    [items],
  );
  const paymentsPayload = useMemo(
    () =>
      JSON.stringify(
        payments.map((payment) => ({
          method: payment.method,
          amount: payment.amount || "0",
          due_at: payment.due_at,
        })),
      ),
    [payments],
  );

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
          itens
        </p>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-4 gap-4">
              <InputField
                label="produto"
                name={`item_product_${item.id}`}
                value={item.product_name}
                disabled
              />
              <InputField
                label="quantidade"
                name={`item_quantity_${item.id}`}
                value={item.quantity}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, quantity: event.target.value }
                        : current,
                    ),
                  )
                }
                required
              />
              <InputField
                label="preço"
                name={`item_price_${item.id}`}
                value={item.price}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, price: event.target.value }
                        : current,
                    ),
                  )
                }
                required
              />
              <InputField
                label="desconto"
                name={`item_discount_${item.id}`}
                value={item.discount}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, discount: event.target.value }
                        : current,
                    ),
                  )
                }
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
          pagamentos
        </p>

        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={payment.id} className="grid grid-cols-3 gap-4">
              <InputField
                label="método"
                name={`payment_method_${payment.id}`}
                value={payment.method_description}
                disabled
              />
              <InputField
                label="valor"
                name={`payment_amount_${payment.id}`}
                value={payment.amount}
                onChange={(event) =>
                  setPayments((prev) =>
                    prev.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, amount: event.target.value }
                        : current,
                    ),
                  )
                }
                required
              />
              <InputField
                label="vencimento"
                name={`payment_due_at_${payment.id}`}
                type="date"
                value={payment.due_at}
                onChange={(event) =>
                  setPayments((prev) =>
                    prev.map((current, currentIndex) =>
                      currentIndex === index
                        ? { ...current, due_at: event.target.value }
                        : current,
                    ),
                  )
                }
                required
              />
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="items" value={itemsPayload} />
      <input type="hidden" name="payment_methods" value={paymentsPayload} />

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
