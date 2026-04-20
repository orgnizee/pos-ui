"use client";

import { useActionState, useState } from "react";
import {
  updatePaymentAction,
  PaymentActionState,
} from "@/lib/api/actions/payments";
import { Payment, RecurrenceOption, PaymentStatus } from "@/lib/api/payments";
import { Customer } from "@/lib/api/customers";
import { Supplier } from "@/lib/api/suppliers";
import { FinanceCategory } from "@/lib/api/finance-category";
import CategoryPickerModal from "@/components/category-picker-modal";

interface EditPaymentFormProps {
  id: string;
  payment: Payment;
  contacts: Customer[] | Supplier[];
  categories: FinanceCategory[];
}

function isCustomer(c: Customer | Supplier): c is Customer {
  return "name" in c;
}

function parseCents(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

export default function EditPaymentForm({
  id,
  payment,
  contacts,
  categories,
}: EditPaymentFormProps) {
  const boundAction = updatePaymentAction.bind(null, id);
  const [state, action, pending] = useActionState<PaymentActionState, FormData>(
    boundAction,
    null,
  );

  const [recurrence, setRecurrence] = useState<RecurrenceOption>(
    payment.recurrence,
  );
  const [categoryValue, setCategoryValue] = useState(
    payment.category?.id ?? "",
  );
  const [cents, setCents] = useState(() => parseCents(payment.total_amount));
  const [amountPaidCents, setAmountPaidCents] = useState(() =>
    parseCents(payment.amount_paid),
  );
  const [status, setStatus] = useState<PaymentStatus>(payment.status);

  const formatBRL = (c: number) =>
    (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <form action={action} className="w-full px-6 py-6 flex flex-col gap-6">
      {/* Amount */}
      <Section label="valor">
        <input
          type="text"
          inputMode="numeric"
          value={formatBRL(cents)}
          onChange={(e) => setCents(Number(e.target.value.replace(/\D/g, "")))}
          className="text-3xl normal-case outline-none"
        />
        <input
          type="hidden"
          name="total_amount"
          value={(cents / 100).toFixed(2)}
        />
      </Section>

      {/* Main info */}
      <Section label="informações">
        <Row>
          <DateField name="issued_at" defaultValue={payment.issued_at} />
          <DateField name="due_at" required defaultValue={payment.due_at} />
        </Row>

        <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
          <input type="hidden" name="category" value={categoryValue} />
          <CategoryPickerModal
            categories={categories}
            value={categoryValue}
            onChange={setCategoryValue}
          />
        </div>

        <SelectField
          name="contact"
          placeholder="contato"
          defaultValue={payment.contact.id}
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {isCustomer(c)
                ? c.name.toLocaleLowerCase()
                : c.legal_name.toLocaleLowerCase()}
            </option>
          ))}
        </SelectField>

        <Field
          name="reference"
          placeholder="referência"
          defaultValue={payment.reference ?? ""}
        />
      </Section>

      {/* Recurrence */}
      <Section label="recorrência">
        <SelectField
          name="recurrence"
          placeholder="tipo"
          defaultValue={recurrence}
          onChange={(e) => setRecurrence(e.target.value as RecurrenceOption)}
        >
          <option value="once">única</option>
          <option value="weekly">semanal</option>
          <option value="monthly">mensal</option>
          <option value="installments">parcelado</option>
        </SelectField>

        {recurrence === "weekly" && (
          <SelectField
            name="due_weekday"
            placeholder="dia da semana"
            defaultValue={payment.due_weekday ?? ""}
            required
          >
            <option value="monday">segunda-feira</option>
            <option value="tuesday">terça-feira</option>
            <option value="wednesday">quarta-feira</option>
            <option value="thursday">quinta-feira</option>
            <option value="friday">sexta-feira</option>
            <option value="saturday">sábado</option>
            <option value="sunday">domingo</option>
          </SelectField>
        )}

        {recurrence === "monthly" && (
          <Field
            name="due_day_of_month"
            placeholder="dia do mês (1–31)"
            type="number"
            defaultValue={payment.due_day_of_month?.toString() ?? ""}
          />
        )}

        {recurrence === "installments" && (
          <Field
            name="installment_count"
            placeholder="número de parcelas"
            type="number"
            required
            defaultValue={payment.installment_count?.toString() ?? ""}
          />
        )}
      </Section>

      {/* Status */}
      <Section label="status">
        <SelectField
          name="status"
          placeholder="status"
          defaultValue={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
        >
          <option value="pending">pendente</option>
          <option value="paid">pago</option>
          <option value="overdue">vencido</option>
          <option value="partially_paid">parcialmente pago</option>
        </SelectField>

        {(status === "paid" || status === "partially_paid") && (
          <>
            <DateField name="paid_at" defaultValue={payment.paid_at ?? ""} />

            <div className="flex flex-col gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={formatBRL(amountPaidCents)}
                onChange={(e) =>
                  setAmountPaidCents(Number(e.target.value.replace(/\D/g, "")))
                }
                placeholder="valor pago"
                className="w-full h-10 p-2 text-sm font-light rounded-md bg-background placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
              />
              <input
                type="hidden"
                name="amount_paid"
                value={(amountPaidCents / 100).toFixed(2)}
              />
            </div>

            <Field
              name="payment_method"
              placeholder="método de pagamento"
              defaultValue={payment.payment_method ?? ""}
            />
          </>
        )}
      </Section>

      {/* Notes */}
      <Section label="observações">
        <textarea
          name="notes"
          placeholder="anotações..."
          rows={3}
          defaultValue={payment.notes ?? ""}
          className="w-full p-2 text-sm font-light bg-background rounded-md placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md resize-none"
        />
      </Section>

      {/* Error + submit */}
      <div className="flex flex-col items-end gap-2">
        {state && "error" in state && (
          <p className="text-xs font-light normal-case text-red-500">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center w-14 px-2 py-0.5 rounded-md bg-black text-sm text-white cursor-pointer disabled:opacity-50"
        >
          salvar
        </button>
      </div>
    </form>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-light text-primary uppercase tracking-widest">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

function Field({
  name,
  placeholder,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      />
    </div>
  );
}

function DateField({
  name,
  required,
  defaultValue,
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <input
        name={name}
        type="date"
        required={required}
        defaultValue={defaultValue}
        className="w-full h-full p-2 text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      />
    </div>
  );
}

function SelectField({
  name,
  placeholder,
  required,
  defaultValue,
  onChange,
  children,
}: {
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        onChange={onChange}
        className="w-full h-full p-2 text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}
