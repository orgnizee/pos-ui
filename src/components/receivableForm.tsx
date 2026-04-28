"use client";

import { useActionState, useState } from "react";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { PaymentType, RecurrenceOption } from "@/lib/api/receivables";
import {
  createReceivableAction,
  ReceivableActionState,
} from "@/lib/api/actions/receivables";

import { InputField } from "./inputField";
import { SelectInputField } from "./inputFieldSelect";
import { SearchableSelectInputField } from "./searchableSelectInputField";
import { InputTextareaField } from "./inputTextAreaField";
import { buildCategoryGroups } from "@/lib/categoryGroups";
import { Contact } from "@/lib/api/contacts";

interface PaymentFormProps {
  contacts: Contact[];
  categories: FinanceCategory[];
  defaultType?: PaymentType;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

export default function ReceivableForm({
  contacts,
  categories,
  defaultType = "payable",
}: PaymentFormProps) {
  const [state, action, pending] = useActionState<
    ReceivableActionState,
    FormData
  >(createReceivableAction, null);

  const [recurrence, setRecurrence] = useState<RecurrenceOption>("once");
  const [cents, setCents] = useState(0);

  const displayValue = (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      <input type="hidden" name="payment_type" value={defaultType} />

      {/* Valor */}
      <div className="mb-8">
        <SectionLabel label="valor" />
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={(e) => setCents(Number(e.target.value.replace(/\D/g, "")))}
          className="text-3xl font-light outline-none border-b border-tertiary/30 focus:border-tertiary w-full pb-2"
        />
        <input
          type="hidden"
          name="total_amount"
          value={(cents / 100).toFixed(2)}
        />
      </div>

      {/* Informações */}
      <div className="mb-8">
        <SectionLabel label="informações" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <InputField label="emissão" name="issued_at" type="date" required />
          <InputField label="vencimento" name="due_at" type="date" required />

          <SearchableSelectInputField
            label="contato"
            name="contact"
            required
            defaultValue=""
            options={contacts.map((c) => ({
              value: String(c.id),
              label:
                c.kind === "customer"
                  ? c.name.toUpperCase()
                  : c.legal_name.toUpperCase(),
            }))}
          />

          <InputField label="referência" name="reference" />

          <SelectInputField
            label="categoria"
            name="category"
            groups={buildCategoryGroups(categories)}
          />
        </div>
      </div>

      {/* Recorrência */}
      <div className="mb-8">
        <SectionLabel label="recorrência" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <SelectInputField
            label="tipo"
            name="recurrence"
            defaultValue={"once"}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceOption)}
            options={[
              { value: "once", label: "ÚNICA" },
              { value: "weekly", label: "SEMANAL" },
              { value: "monthly", label: "MENSAL" },
              { value: "installments", label: "PARCELADO" },
            ]}
          />

          {recurrence === "weekly" && (
            <SelectInputField
              label="dia da semana"
              name="due_weekday"
              required
              options={[
                { value: "monday", label: "segunda-feira" },
                { value: "tuesday", label: "terça-feira" },
                { value: "wednesday", label: "quarta-feira" },
                { value: "thursday", label: "quinta-feira" },
                { value: "friday", label: "sexta-feira" },
                { value: "saturday", label: "sábado" },
                { value: "sunday", label: "domingo" },
              ]}
            />
          )}

          {recurrence === "monthly" && (
            <InputField
              label="dia do mês (1-31)"
              name="due_day_of_month"
              type="number"
            />
          )}

          {recurrence === "installments" && (
            <>
              <InputField
                label="parcelas"
                name="installment_count"
                type="number"
                required
              />
              <InputField
                label="dia do vencimento (1-31)"
                name="due_day_of_month"
                type="number"
                required
              />
            </>
          )}
        </div>
      </div>

      {/* Observações */}
      <div className="mb-8">
        <SectionLabel label="observações" />
        <InputTextareaField
          required
          label=""
          name="notes"
          rows={3}
          className="w-full p-0 text-sm font-light bg-transparent border-b border-tertiary/30 placeholder:text-tertiary/50 outline-none focus:border-tertiary resize-none"
        />
      </div>

      {/* Submit */}
      <div className="mt-10 w-full">
        {error && (
          <p className="mb-2 text-xs font-light normal-case text-red-500">
            {error}
          </p>
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
