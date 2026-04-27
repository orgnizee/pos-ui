"use client";

import { OrderActionState } from "@/lib/api/actions/orders";
import { SelectInputField } from "../inputFieldSelect";
import { InputTextareaField } from "../inputTextAreaField";
import { CartItem, CustomerOption, PaymentEntry } from "./types";
import { formatBRL, lineTotalCents, parseCurrencyToCents } from "./utils";
import { PaymentMethod } from "@/lib/api/paymentMethods";

type Props = {
  showCheckoutDrawer: boolean;
  orderTotal: number;
  orderAction: (payload: FormData) => void;
  amountPaidInputRef: React.RefObject<HTMLInputElement | null>;
  discountAmount: string;
  payableBeforeOrderDiscountCents: number;
  isPaymentAmountManuallyEdited: boolean;
  setDiscountCents: (value: number) => void;
  setPayments: React.Dispatch<React.SetStateAction<PaymentEntry[]>>;
  amountReceived: string;
  setAmountReceivedCents: (value: number) => void;
  change: number;
  customer: CustomerOption;
  cart: CartItem[];
  payments: PaymentEntry[];
  today: string;
  isFiadoMethod: (methodId: string) => boolean;
  getDueDate: () => string;
  paymentMethods: PaymentMethod[];
  setIsPaymentAmountManuallyEdited: (value: boolean) => void;
  remaining: number;
  orderState: OrderActionState | null;
  finalizeButtonRef: React.RefObject<HTMLButtonElement | null>;
  canSubmitOrder: boolean;
  pendingOrder: boolean;
  onClose: () => void;
  orderDiscountCents: number;
};

export function CheckoutDrawer({
  showCheckoutDrawer,
  orderTotal,
  orderAction,
  amountPaidInputRef,
  discountAmount,
  payableBeforeOrderDiscountCents,
  isPaymentAmountManuallyEdited,
  setDiscountCents,
  setPayments,
  amountReceived,
  setAmountReceivedCents,
  change,
  customer,
  cart,
  payments,
  today,
  isFiadoMethod,
  getDueDate,
  paymentMethods,
  setIsPaymentAmountManuallyEdited,
  remaining,
  orderState,
  finalizeButtonRef,
  canSubmitOrder,
  pendingOrder,
  onClose,
  orderDiscountCents,
}: Props) {
  if (!showCheckoutDrawer) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/90 z-40" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-white border-l z-50 p-6 overflow-y-auto">
        <h2 className="text-4xl uppercase">Total {formatBRL(orderTotal)}</h2>

        <form action={orderAction} className="mt-4 flex flex-col gap-1">
          <div className="flex justify-between">
            <span>valor recebido</span>
            <input
              ref={amountPaidInputRef}
              value={(amountReceived)}
              onChange={(e) => setAmountReceivedCents(parseCurrencyToCents(e.target.value))}
              className="text-primary placeholder:text-secondary outline-none text-end"
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
          </div>

          <div className="flex justify-between">
            <p className="">desconto</p>

            <input
              value={discountAmount}
              onChange={(e) => {
                const nextDiscountCents = parseCurrencyToCents(e.target.value);
                const normalizedDiscountCents = Math.min(
                  nextDiscountCents,
                  payableBeforeOrderDiscountCents,
                );
                setDiscountCents(normalizedDiscountCents);

                if (!isPaymentAmountManuallyEdited) {
                  const nextOrderTotal = Math.max(
                    (payableBeforeOrderDiscountCents - normalizedDiscountCents) / 100,
                    0,
                  );
                  setPayments((prev) =>
                    prev.map((payment, idx) =>
                      idx === 0 ? { ...payment, amount: nextOrderTotal.toFixed(2) } : payment,
                    ),
                  );
                }
              }}
              className="text-primary placeholder:text-secondary outline-none text-end"
              placeholder="R$ 0,00"
              inputMode="numeric"
            />
          </div>
          <input
            type="hidden"
            name="discount_amount"
            value={(orderDiscountCents / 100).toFixed(2)}
          />

          <div className="flex justify-between">
            <span>troco</span>
            <span>{formatBRL(change)}</span>
          </div>

          <input type="hidden" name="customer" value={customer.id ?? ""} />
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              cart.map((item) => ({
                product: item.product.id,
                quantity: item.quantity,
                price: item.product.price ?? "0",
                discount: (
                  Math.min(item.discountCents, lineTotalCents(item.product.price, item.quantity)) /
                  100
                ).toFixed(2),
              })),
            )}
          />
          <input type="hidden" name="payment_methods" value={JSON.stringify(payments)} />
          <input type="hidden" name="order_date" value={today} />
          <input type="hidden" name="status" value="completed" />

          <p className="mt-8 uppercase text-tertiary">formas de pagamento</p>
          <div className="border p-3 space-y-3">
            {payments.map((payment, idx) => (
              <div key={`${payment.method}-${idx}`} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <SelectInputField
                    id={`payment-method-${idx}`}
                    label="pagamento"
                    value={payment.method}
                    onChange={(e) => {
                      const selectedMethodId = e.target.value;
                      setPayments((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? {
                                ...p,
                                method: selectedMethodId,
                                due_at: isFiadoMethod(selectedMethodId) ? getDueDate() : today,
                              }
                            : p,
                        ),
                      );
                    }}
                    options={paymentMethods.map((m) => ({
                      label: m.description.toUpperCase(),
                      value: m.id,
                    }))}
                  />
                </div>

                <div className="col-span-6">
                  <input
                    value={formatBRL(Number(payment.amount) || 0)}
                    onChange={(e) => {
                      setIsPaymentAmountManuallyEdited(true);
                      setPayments((prev) =>
                        prev.map((p, i) =>
                          i === idx
                            ? {
                                ...p,
                                amount: (parseCurrencyToCents(e.target.value) / 100).toFixed(2),
                              }
                            : p,
                        ),
                      );
                    }}
                    className="text-primary placeholder:text-secondary outline-none text-end w-full mt-6"
                    placeholder="R$ 0,00"
                    inputMode="numeric"
                  />
                </div>

                {isFiadoMethod(payment.method) && (
                  <div className="col-span-12">
                    <label htmlFor={`payment-due-at-${idx}`} className="text-xs text-tertiary">
                      vencimento
                    </label>
                    <input
                      id={`payment-due-at-${idx}`}
                      type="date"
                      value={payment.due_at || getDueDate()}
                      onChange={(e) =>
                        setPayments((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, due_at: e.target.value } : p)),
                        )
                      }
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}

            {Math.abs(remaining) >= 0.001 && (
              <p className="text-xs text-red-500">
                a soma dos pagamentos deve ser igual ao total do pedido.
              </p>
            )}
          </div>

          <InputTextareaField label="observações" name="notes" />

          <div className="absolute bottom-25 right-5">
            <p className="text-4xl">a pagar {formatBRL(orderTotal)}</p>
          </div>

          {orderState?.error && <p className="text-sm text-red-500">{orderState.message}</p>}

          <div className="absolute bottom-5 w-132">
            <button
              id="btn-finalizar"
              ref={finalizeButtonRef}
              disabled={!canSubmitOrder || pendingOrder}
              className="border w-full bg-black text-white broder p-2 uppercase disabled:opacity-40"
            >
              {pendingOrder ? "salvando..." : "finalizar [ctrl + 5]"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
