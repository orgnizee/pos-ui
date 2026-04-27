"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { Account } from "@/lib/api/bankAccounts";
import { Receivable } from "@/lib/api/receivables";
import {
  settleReceivableAction,
  SettleReceivableActionState,
} from "@/lib/api/actions/settleReceivable";
import { InputField } from "./inputField";
import { formatBRL } from "@/lib/utils/format";
import { SelectInputField } from "./inputFieldSelect";

interface SettlePaymentModalProps {
  payment: Receivable;
  accounts: Account[];
  onClose: () => void;
}

function parseCents(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

export default function SettlePaymentModal({
  payment,
  accounts,
  onClose,
}: SettlePaymentModalProps) {
  const boundAction = settleReceivableAction.bind(null, payment.id);
  const [state, action, pending] = useActionState<
    SettleReceivableActionState,
    FormData
  >(boundAction, null);

  const outstanding = parseCents(payment.outstanding_balance);
  const [cents, setCents] = useState(outstanding);
  const overlayRef = useRef<HTMLDivElement>(null);

  const accountOptions = accounts.map((a) => ({
    label: a.name.toUpperCase(),
    value: String(a.id),
  }));

  // close on overlay click
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-white/90"
    >
      <div className="w-full sm:w-120 border bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <p className="text-sm font-light uppercase tracking-widest text-primary">
            liquidar recebimento
          </p>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary text-xs uppercase tracking-widest font-light"
          >
            cancelar
          </button>
        </div>

        {/* Payment summary */}
        <div className="px-6 pb-4 flex flex-col gap-0.5">
          <p className="text-xs font-light text-tertiary uppercase tracking-widest">
            saldo devedor
          </p>
          <p className="text-2xl font-light">
            {formatBRL(payment.outstanding_balance)}
          </p>
          {payment.reference && (
            <p className="text-xs font-light text-tertiary normal-case">
              ref. {payment.reference}
            </p>
          )}
        </div>

        <form action={action} className="px-6 pb-8 flex flex-col gap-4">
          {/* Amount */}
          <div className="flex flex-col gap-0.5">
            <InputField
              label="valor recebido"
              type="text"
              inputMode="numeric"
              value={formatBRL((cents / 100).toFixed(2))}
              onChange={(e) =>
                setCents(Number(e.target.value.replace(/\D/g, "")))
              }
            />
            <input
              type="hidden"
              name="amount"
              value={(cents / 100).toFixed(2)}
            />
          </div>

          {/* Account */}
          <div className="flex flex-col gap-0.5">
            <SelectInputField
              label="conta"
              name="account"
              required
              defaultValue=""
              options={accountOptions}
            />
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
            className="w-full py-2 bg-black text-sm text-white uppercase cursor-pointer disabled:bg-white disabled:text-primary disabled:border"
          >
            confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
