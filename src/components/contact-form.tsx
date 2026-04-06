"use client";

import { useActionState, useState } from "react";
import {
  createCustomerAction,
  CustomerActionState,
} from "@/lib/api/actions/customer";
import {
  createSupplierAction,
  SupplierActionState,
} from "@/lib/api/actions/supplier";
import MaskedInput from "./masked-input";
import { formatCNPJ, formatCPF, formatPhone } from "@/lib/utils/format";

type ContactType = "customer" | "supplier";
type ActionState = CustomerActionState | SupplierActionState;

export default function ContactForm() {
  const [type, setType] = useState<ContactType>("customer");

  const [customerState, customerAction, customerPending] = useActionState<
    CustomerActionState,
    FormData
  >(createCustomerAction, null);
  const [supplierState, supplierAction, supplierPending] = useActionState<
    SupplierActionState,
    FormData
  >(createSupplierAction, null);

  const action = type === "customer" ? customerAction : supplierAction;
  const state: ActionState =
    type === "customer" ? customerState : supplierState;
  const pending = customerPending || supplierPending;

  return (
    <form action={action} className="w-full px-6 py-6 flex flex-col gap-6">
      {/* Type toggle */}
      <div className="flex gap-2">
        {(["customer", "supplier"] as ContactType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-2 py-0.5 text-sm rounded-md transition-colors ${
              type === t
                ? "bg-black text-white"
                : "bg-black/5 text-tertiary cursor-pointer"
            }`}
          >
            {t === "customer" ? "cliente" : "fornecedor"}
          </button>
        ))}
      </div>

      {/* Identity */}
      <Section label="identificação">
        {type === "customer" ? (
          <>
            <Row>
              <Field name="name" placeholder="nome" required />
              <Field name="alias" placeholder="apelido" />
            </Row>
            <Row>
              <MaskedInput name="cpf" placeholder="cpf" formatter={formatCPF} />
              <Field name="code" placeholder="código" required />
            </Row>
            <div className="w-full sm:w-1/2 pr-0 sm:pr-1">
              <SelectField name="gender" placeholder="gênero">
                <option value="male">masculino</option>
                <option value="female">feminino</option>
                <option value="unkown">não informado</option>
              </SelectField>
            </div>
          </>
        ) : (
          <>
            <Row>
              <Field name="legal_name" placeholder="razão social" required />
              <Field name="trade_name" placeholder="nome fantasia" />
            </Row>
            <Row>
              <MaskedInput name="cnpj" placeholder="cnpj" formatter={formatCNPJ} />
              <Field name="code" placeholder="código" />
            </Row>
            <Row>
              <Field name="ie" placeholder="inscrição estadual" />
              <Field name="im" placeholder="inscrição municipal" />
            </Row>
          </>
        )}
      </Section>

      {/* Contact */}
      <Section label="contato">
        <Row>
          <MaskedInput name="phone" placeholder="telefone" formatter={formatPhone} />
          <Field name="email" placeholder="e-mail" type="email" />
        </Row>
      </Section>

      {/* Address */}
      <Section label="endereço">
        <Row>
          <Field name="postcode" placeholder="cep" maxLength={8} />
          <Field name="city" placeholder="cidade" />
        </Row>
        <Row>
          <Field name="state" placeholder="estado" maxLength={2} />
          <Field name="address" placeholder="logradouro" />
        </Row>
      </Section>

      {/* Notes */}
      <Section label="observações">
        <textarea
          name="notes"
          placeholder="anotações sobre o contato..."
          rows={3}
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
      <p className="text-xs font-light text-tertiary uppercase tracking-widest">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

interface FieldProps {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}

function Field({
  name,
  placeholder,
  type = "text",
  required,
  maxLength,
}: FieldProps) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        maxLength={maxLength}
        className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      />
    </div>
  );
}

function SelectField({
  name,
  placeholder,
  children,
}: {
  name: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <select
        name={name}
        defaultValue=""
        className="w-full h-full p-2 text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    </div>
  );
}
