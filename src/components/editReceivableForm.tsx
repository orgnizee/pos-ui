"use client";

import { useActionState, useState } from "react";
import {
  updateReceivableAction,
  ReceivableActionState,
} from "@/lib/api/actions/receivables";
import {
  PaymentStatus,
  Receivable,
  RecurrenceOption,
} from "@/lib/api/receivables";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { SelectInputField } from "./inputFieldSelect";
import { SearchableSelectInputField } from "./searchableSelectInputField";
import { buildCategoryGroups } from "@/lib/categoryGroups";
import { InputField } from "./inputField";
import { Contact } from "@/lib/api/contacts";

interface EditPaymentFormProps {
  id: string;
  payment: Receivable;
  contacts: Contact[];
  categories: FinanceCategory[];
}

function parseCents(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

// Matching your first form's section labels
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

export default function EditReceivableForm({
  id,
  payment,
  contacts,
  categories,
}: EditPaymentFormProps) {
  const boundAction = updateReceivableAction.bind(null, id);
  const [state, action, pending] = useActionState<
    ReceivableActionState,
    FormData
  >(boundAction, null);

  const [recurrence, setRecurrence] = useState<RecurrenceOption>(
    payment.recurrence,
  );

  const [status, setStatus] = useState<PaymentStatus>(payment.status);

  const [cents, setCents] = useState(() => parseCents(payment.total_amount));
  const [amountPaidCents, setAmountPaidCents] = useState(() =>
    parseCents(payment.amount_paid),
  );

  const statusOptions = [
    { value: "pending", label: "PENDENTE" },
    { value: "paid", label: "PAGO" },
    { value: "overdue", label: "VENCIDO" },
    { value: "partially_paid", label: "PARCIALMENTE PAGO" },
  ];

  const recurreceOptions = [
    { value: "once", label: "ÚNICA" },
    { value: "weekly", label: "SEMANAL" },
    { value: "monthly", label: "MENSAL" },
    { value: "installments", label: "PARCELADO" },
  ];

  const weekOptions = [
    { value: "monday", label: "SEGUNDA" },
    { value: "tuesday", label: "TERÇA" },
    { value: "wednesday", label: "QUARTA" },
    { value: "thursday", label: "QUINTA" },
    { value: "friday", label: "SEXTA" },
    { value: "saturday", label: "SÁBADO" },
    { value: "sunday", label: "DOMINGO" },
  ];

  const formatBRL = (c: number) =>
    (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      {/* Valor Principal */}
      <div className="mb-8">
        <SectionLabel label="valor" />
        <input
          type="text"
          inputMode="numeric"
          value={formatBRL(cents)}
          onChange={(e) => setCents(Number(e.target.value.replace(/\D/g, "")))}
          className="text-3xl font-light outline-none border-b border-tertiary/30 focus:border-tertiary w-full pb-2"
        />
        <input
          type="hidden"
          name="total_amount"
          value={(cents / 100).toFixed(2)}
        />
      </div>

      {/* Informações Grid */}
      <div className="mb-8">
        <SectionLabel label="informações" />
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-x-8 gap-y-8">
          <InputField
            label="emissão"
            name="issued_at"
            type="date"
            defaultValue={payment.issued_at}
          />

          <InputField
            label="vencimento"
            name="due_at"
            type="date"
            required
            defaultValue={payment.due_at}
          />

          <SelectInputField
            label="categoria"
            name="category"
            groups={buildCategoryGroups(categories)}
            defaultValue={payment.category?.name}
          />

          <SearchableSelectInputField
            label="contato"
            name="contact"
            defaultValue={payment.contact.id}
            options={contacts.map((c) => ({
              value: String(c.id),
              label:
                c.kind === "customer"
                  ? c.name.toUpperCase()
                  : c.legal_name.toUpperCase(),
            }))}
          />

          <InputField
            label="referência"
            name="reference"
            defaultValue={payment.reference ?? ""}
          />

          <SelectInputField
            label="status"
            name="status"
            defaultValue={payment.status}
            options={statusOptions}
          ></SelectInputField>
        </div>
      </div>

      {/* Pagamento Detalhes (Condicional) */}
      {(status === "paid" || status === "partially_paid") && (
        <div className="mb-8">
          <SectionLabel label="detalhes do pagamento" />
          <div className="grid grid-cols-3 gap-x-8 gap-y-8">
            <InputField
              label="pago em"
              name="paid_at"
              type="date"
              defaultValue={payment.paid_at ?? ""}
            />

            <div className="flex flex-col border-b border-tertiary/30 focus-within:border-tertiary transition-colors">
              <span className="text-xs font-light text-tertiary uppercase tracking-widest mb-1">
                valor pago
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatBRL(amountPaidCents)}
                onChange={(e) =>
                  setAmountPaidCents(Number(e.target.value.replace(/\D/g, "")))
                }
                className="w-full text-sm font-light bg-transparent outline-none pb-1"
              />
              <input
                type="hidden"
                name="amount_paid"
                value={(amountPaidCents / 100).toFixed(2)}
              />
            </div>

            <InputField
              label="método"
              name="payment_method"
              defaultValue={payment.payment_method ?? ""}
            />
          </div>
        </div>
      )}

      {/* Recorrência Grid */}
      <div className="mb-8">
        <SectionLabel label="recorrência" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <SelectInputField
            label="tipo"
            name="recurrence"
            defaultValue={recurrence}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceOption)}
            options={recurreceOptions}
          />

          {recurrence === "weekly" && (
            <SelectInputField
              label="dia da semana"
              name="due_weekday"
              required
              defaultValue={payment.due_weekday ?? ""}
              options={weekOptions}
            />
          )}

          {recurrence === "monthly" && (
            <InputField
              label="dia do mês (1-31)"
              name="due_day_of_month"
              type="number"
              defaultValue={payment.due_day_of_month?.toString()}
            />
          )}

          {recurrence === "installments" && (
            <InputField
              label="parcelas"
              name="installment_count"
              type="number"
              required
              defaultValue={payment.installment_count?.toString()}
            />
          )}
        </div>
      </div>

      {/* Observações */}
      <div className="mb-8">
        <SectionLabel label="observações" />
        <textarea
          name="notes"
          rows={3}
          defaultValue={payment.notes ?? ""}
          className="w-full p-0 text-sm font-light bg-transparent border-b border-tertiary/30 placeholder:text-tertiary/50 outline-none focus:border-tertiary resize-none"
        />
      </div>

      {/* Submit */}
      <div className="mt-10 w-full">
        {error && (
          <p className="mb-2 text-xs font-light text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-5 py-1.5 text-sm border border-black uppercase disabled:opacity-50 cursor-pointer transition-opacity"
        >
          {pending ? "salvando..." : "salvar alterações"}
        </button>
      </div>
    </form>
  );
}
