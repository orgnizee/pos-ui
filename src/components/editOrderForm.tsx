"use client";

import { useActionState, useMemo, useState } from "react";
import { InputField } from "./inputField";
import { InputTextareaField } from "./inputTextAreaField";
import { SelectInputField } from "./inputFieldSelect";
import { Order } from "@/lib/api/orders";
import { updateOrderAction, OrderActionState } from "@/lib/api/actions/orders";
import { Product } from "@/lib/api/products";
import { PaymentMethod } from "@/lib/api/paymentMethods";
import { formatBRL } from "./pdv/utils";

type EditableItem = {
  id: string;
  product: string;
  quantity: string;
  price: string;
  discount: string;
};

type EditablePayment = {
  id: string;
  method: string;
  amount: string;
  due_at: string;
};

function parseMoney(value: string) {
  const parsed = Number.parseFloat((value || "0").replace(",", "."));
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
}

function formatMoneyInput(value: number) {
  return value.toFixed(2);
}

function parseQuantity(value: string) {
  const parsed = Number.parseFloat((value || "0").replace(",", "."));
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
}

export default function EditOrderForm({
  id,
  order,
  products,
  paymentMethods,
}: {
  id: string;
  order: Order;
  products: Product[];
  paymentMethods: PaymentMethod[];
}) {
  const [items, setItems] = useState<EditableItem[]>(
    order.items.map((item) => ({
      id: item.id,
      product: item.product.id,
      quantity: String(item.quantity),
      price: item.price,
      discount: item.discount,
    })),
  );
  const [payments, setPayments] = useState<EditablePayment[]>(
    order.payment_methods.map((method) => ({
      id: method.id,
      method: method.method.id,
      amount: method.amount,
      due_at: method.due_at.split("T")[0],
    })),
  );
  const [discountAmount, setDiscountAmount] = useState(order.discount_amount ?? "0.00");

  const [state, action, pending] = useActionState<OrderActionState, FormData>(
    updateOrderAction.bind(null, id),
    null,
  );

  const productById = useMemo(
    () =>
      new Map(
        products.map((product) => [
          product.id,
          {
            name: product.name,
            price: product.price ?? "0",
          },
        ]),
      ),
    [products],
  );

  const paymentMethodById = useMemo(
    () => new Map(paymentMethods.map((method) => [method.id, method.description])),
    [paymentMethods],
  );

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + parseMoney(item.price) * Math.max(parseQuantity(item.quantity), 0),
      0,
    );

    const itemsDiscount = items.reduce((acc, item) => {
      const lineBase = parseMoney(item.price) * Math.max(parseQuantity(item.quantity), 0);
      return acc + Math.min(parseMoney(item.discount), Math.max(lineBase, 0));
    }, 0);

    const orderDiscount = Math.max(parseMoney(discountAmount), 0);
    const total = Math.max(subtotal - itemsDiscount - orderDiscount, 0);

    const paymentsTotal = payments.reduce((acc, payment) => acc + parseMoney(payment.amount), 0);

    return {
      subtotal,
      itemsDiscount,
      orderDiscount,
      total,
      paymentsTotal,
      difference: paymentsTotal - total,
    };
  }, [items, payments, discountAmount]);

  const invalidItems =
    items.length === 0 ||
    items.some((item) => !item.product || parseQuantity(item.quantity) <= 0 || parseMoney(item.price) < 0);

  const invalidPayments =
    payments.length === 0 ||
    payments.some((payment) => !payment.method || !payment.due_at || parseMoney(payment.amount) < 0);

  const paymentMismatch = Math.abs(totals.difference) > 0.009;

  const formError =
    invalidItems
      ? "adicione ao menos um item válido para a venda."
      : invalidPayments
        ? "adicione ao menos um pagamento válido para a venda."
        : paymentMismatch
          ? "a soma dos pagamentos deve ser igual ao valor total da venda."
          : undefined;

  const error = state && "error" in state ? state.message : undefined;

  const itemsPayload = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          ...(item.id.startsWith("new-item-") ? {} : { id: item.id }),
          product: item.product,
          quantity: parseQuantity(item.quantity),
          price: formatMoneyInput(parseMoney(item.price)),
          discount: formatMoneyInput(Math.max(parseMoney(item.discount), 0)),
        })),
      ),
    [items],
  );

  const paymentsPayload = useMemo(
    () =>
      JSON.stringify(
        payments.map((payment) => ({
          ...(payment.id.startsWith("new-payment-") ? {} : { id: payment.id }),
          method: payment.method,
          amount: formatMoneyInput(Math.max(parseMoney(payment.amount), 0)),
          due_at: payment.due_at,
        })),
      ),
    [payments],
  );

  const itemOptions = products.map((product) => ({
    label: product.name.toUpperCase(),
    value: product.id,
  }));

  const paymentOptions = paymentMethods.map((method) => ({
    label: method.description.toUpperCase(),
    value: method.id,
  }));

  return (
    <form action={action} className="w-full max-w-5xl mt-12 mb-6">
      <div className="mb-8">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">venda</p>

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
            label="desconto da venda"
            name="discount_amount"
            value={discountAmount}
            onChange={(event) => setDiscountAmount(event.target.value)}
          />
        </div>
      </div>

      <div className="mb-10 border p-4">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">resumo</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
          <p>subtotal: {formatBRL(totals.subtotal)}</p>
          <p>desc. itens: {formatBRL(totals.itemsDiscount)}</p>
          <p>desc. venda: {formatBRL(totals.orderDiscount)}</p>
          <p className="font-medium">total da venda: {formatBRL(totals.total)}</p>
          <p>total pagamentos: {formatBRL(totals.paymentsTotal)}</p>
          <p className={paymentMismatch ? "text-red-500" : "text-green-700"}>
            diferença: {formatBRL(totals.difference)}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-light text-tertiary uppercase tracking-widest">itens</p>
          <button
            type="button"
            className="border px-3 py-1 text-xs uppercase"
            onClick={() => {
              const fallbackProduct = products[0];
              setItems((prev) => [
                ...prev,
                {
                  id: `new-item-${Date.now()}`,
                  product: fallbackProduct?.id ?? "",
                  quantity: "1",
                  price: fallbackProduct?.price ?? "0.00",
                  discount: "0.00",
                },
              ]);
            }}
          >
            adicionar item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 border p-3">
              <div className="col-span-4">
                <SelectInputField
                  label="produto"
                  value={item.product}
                  onChange={(event) => {
                    const nextProductId = event.target.value;
                    const selectedProduct = productById.get(nextProductId);
                    setItems((prev) =>
                      prev.map((current, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...current,
                              product: nextProductId,
                              price: selectedProduct?.price ?? current.price,
                            }
                          : current,
                      ),
                    );
                  }}
                  options={itemOptions}
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="quantidade"
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
              </div>

              <div className="col-span-2">
                <InputField
                  label="preço"
                  value={item.price}
                  onChange={(event) =>
                    setItems((prev) =>
                      prev.map((current, currentIndex) =>
                        currentIndex === index ? { ...current, price: event.target.value } : current,
                      ),
                    )
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="desconto"
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

              <div className="col-span-2 flex items-end">
                <button
                  type="button"
                  className="w-full border px-3 py-2 text-xs uppercase"
                  onClick={() =>
                    setItems((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
                  }
                >
                  excluir
                </button>
              </div>

              <div className="col-span-12 text-xs text-tertiary">
                total do item: {formatBRL(
                  Math.max(
                    parseMoney(item.price) * Math.max(parseQuantity(item.quantity), 0) -
                      Math.max(parseMoney(item.discount), 0),
                    0,
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-light text-tertiary uppercase tracking-widest">pagamentos</p>
          <button
            type="button"
            className="border px-3 py-1 text-xs uppercase"
            onClick={() => {
              const fallbackMethod = paymentMethods[0];
              setPayments((prev) => [
                ...prev,
                {
                  id: `new-payment-${Date.now()}`,
                  method: fallbackMethod?.id ?? "",
                  amount: "0.00",
                  due_at: today,
                },
              ]);
            }}
          >
            adicionar pagamento
          </button>
        </div>

        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={payment.id} className="grid grid-cols-12 gap-4 border p-3">
              <div className="col-span-5">
                <SelectInputField
                  label="método"
                  value={payment.method}
                  onChange={(event) =>
                    setPayments((prev) =>
                      prev.map((current, currentIndex) =>
                        currentIndex === index
                          ? { ...current, method: event.target.value }
                          : current,
                      ),
                    )
                  }
                  options={paymentOptions}
                />
              </div>

              <div className="col-span-3">
                <InputField
                  label="valor"
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
              </div>

              <div className="col-span-3">
                <InputField
                  label="vencimento"
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

              <div className="col-span-1 flex items-end">
                <button
                  type="button"
                  className="w-full border px-2 py-2 text-xs uppercase"
                  onClick={() =>
                    setPayments((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
                  }
                >
                  x
                </button>
              </div>

              <div className="col-span-12 text-xs text-tertiary">
                método selecionado: {paymentMethodById.get(payment.method) ?? "não informado"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="items" value={itemsPayload} />
      <input type="hidden" name="payment_methods" value={paymentsPayload} />

      <div className="mb-8">
        <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">observações</p>

        <InputTextareaField
          label=""
          name="notes"
          rows={3}
          defaultValue={order.notes ?? ""}
          className="w-full p-0 text-sm font-light bg-transparent border-b border-tertiary/30 placeholder:text-tertiary/50 outline-none focus:border-tertiary resize-none"
        />
      </div>

      <div className="mt-10 w-full">
        {error && <p className="mb-2 text-xs font-light normal-case text-red-500">{error}</p>}
        {formError && (
          <p className="mb-2 text-xs font-light normal-case text-red-500">{formError}</p>
        )}
        <button
          type="submit"
          disabled={pending || Boolean(formError)}
          className="w-full px-5 py-1.5 text-sm border uppercase disabled:opacity-50 cursor-pointer"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
