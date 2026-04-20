"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import {
  settlePayableAction,
  SettlePaymentActionState,
} from "@/lib/api/actions/settle-payable";
import { Payable } from "@/lib/api/payable";
import { Account } from "@/lib/api/bank-accounts";

interface SettlePaymentModalProps {
  payable: Payable;
  accounts: Account[];
  onClose: () => void;
}

function parseCents(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

export default function SettlePayableModal({
  payable,
  accounts,
  onClose,
}: SettlePaymentModalProps) {
  const boundAction = settlePayableAction.bind(null, payable.id);
  const [state, action, pending] = useActionState<
    SettlePaymentActionState,
    FormData
  >(boundAction, null);

  const outstanding = parseCents(payable.outstanding_balance);
  const [cents, setCents] = useState(outstanding);
  const overlayRef = useRef<HTMLDivElement>(null);

  // close on overlay click
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const formatBRL = (c: number) =>
    (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30"
    >
      <div className="w-full sm:w-120 bg-background rounded-t-3xl sm:rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <p className="text-sm font-light uppercase tracking-widest text-primary">
            liquidar recebimento
          </p>
          <button
            onClick={onClose}
            className="text-tertiary/60 hover:text-primary text-xs uppercase tracking-widest font-light"
          >
            cancelar
          </button>
        </div>

        {/* Payment summary */}
        <div className="px-6 pb-4 flex flex-col gap-0.5">
          <p className="text-xs font-light text-tertiary/60 uppercase tracking-widest">
            saldo devedor
          </p>
          <p className="text-2xl font-light">{formatBRL(outstanding)}</p>
          {payable.reference && (
            <p className="text-xs font-light text-tertiary/60 normal-case">
              ref. {payable.reference}
            </p>
          )}
        </div>

        <form action={action} className="px-6 pb-8 flex flex-col gap-4">
          {/* Amount */}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-light text-tertiary/60 uppercase tracking-widest pl-0.5">
              valor recebido
            </span>
            <div className="h-10 text-sm font-light rounded-md bg-secondary/10">
              <input
                type="text"
                inputMode="numeric"
                value={formatBRL(cents)}
                onChange={(e) =>
                  setCents(Number(e.target.value.replace(/\D/g, "")))
                }
                className="w-full h-full p-2 text-primary outline-none focus:border focus:border-tertiary focus:rounded-md"
              />
            </div>
            <input
              type="hidden"
              name="amount"
              value={(cents / 100).toFixed(2)}
            />
          </div>

          {/* Account */}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-light text-tertiary/60 uppercase tracking-widest pl-0.5">
              conta
            </span>
            <div className="h-10 text-sm font-light rounded-md bg-secondary/10">
              <select
                name="account"
                required
                defaultValue=""
                className="w-full h-full p-2 text-primary outline-none focus:border focus:border-tertiary focus:rounded-md"
              >
                <option value="" disabled>
                  selecionar conta
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name.toLocaleLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {state && "error" in state && (
            <p className="text-xs font-light normal-case text-red-500">
              {state.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending || cents === 0}
            className="w-full py-2 rounded-md bg-black text-sm text-white font-bold cursor-pointer disabled:opacity-50"
          >
            confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
