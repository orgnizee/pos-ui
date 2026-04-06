"use client";

import { useActionState } from "react";
import {
  updateCustomerAction,
  CustomerActionState,
} from "@/lib/api/actions/customer";
import {
  updateSupplierAction,
  SupplierActionState,
} from "@/lib/api/actions/supplier";
import { Contact } from "@/lib/api/contacts";
import MaskedInput from "@/components/masked-input";
import { formatCPF, formatCNPJ, formatPhone } from "@/lib/utils/format";

type ActionState = CustomerActionState | SupplierActionState;

export default function EditContactForm({
  id,
  contact,
}: {
  id: string;
  contact: Contact;
}) {
  const boundAction =
    contact.kind === "customer"
      ? updateCustomerAction.bind(null, id)
      : updateSupplierAction.bind(null, id);

  const [state, action, pending] = useActionState<ActionState, FormData>(
    boundAction,
    null,
  );

  return (
    <form action={action} className="w-full px-6 py-6 flex flex-col gap-6">
      {/* Identity */}
      <Section label="identificação">
        {contact.kind === "customer" ? (
          <>
            <Row>
              <Field
                name="name"
                placeholder="nome"
                defaultValue={contact.name}
                required
              />
              <Field
                name="alias"
                placeholder="apelido"
                defaultValue={contact.alias ?? ""}
              />
            </Row>
            <Row>
              <MaskedInput
                name="cpf"
                placeholder="cpf"
                formatter={formatCPF}
                defaultValue={contact.cpf ?? ""}
              />
              <Field
                name="code"
                placeholder="código"
                defaultValue={contact.code ?? ""}
              />
            </Row>
            <div className="w-full sm:w-1/2 pr-0 sm:pr-1">
              <SelectField
                name="gender"
                placeholder="gênero"
                defaultValue={contact.gender ?? ""}
              >
                <option value="male">masculino</option>
                <option value="female">feminino</option>
                <option value="unkown">não informado</option>
              </SelectField>
            </div>
          </>
        ) : (
          <>
            <Row>
              <Field
                name="legal_name"
                placeholder="razão social"
                defaultValue={contact.legal_name}
                required
              />
              <Field
                name="trade_name"
                placeholder="nome fantasia"
                defaultValue={contact.trade_name ?? ""}
              />
            </Row>
            <Row>
              <MaskedInput
                name="cnpj"
                placeholder="cnpj"
                formatter={formatCNPJ}
                defaultValue={contact.cnpj ?? ""}
              />
              <Field
                name="code"
                placeholder="código"
                defaultValue={contact.code ?? ""}
              />
            </Row>
            <Row>
              <Field
                name="ie"
                placeholder="inscrição estadual"
                defaultValue={contact.ie ?? ""}
              />
              <Field
                name="im"
                placeholder="inscrição municipal"
                defaultValue={contact.im ?? ""}
              />
            </Row>
          </>
        )}
      </Section>

      {/* Contact */}
      <Section label="contato">
        <Row>
          <MaskedInput
            name="phone"
            placeholder="telefone"
            formatter={formatPhone}
            defaultValue={contact.phone ?? ""}
          />
          <Field
            name="email"
            placeholder="e-mail"
            type="email"
            defaultValue={contact.email ?? ""}
          />
        </Row>
      </Section>

      {/* Address */}
      <Section label="endereço">
        <Row>
          <Field
            name="postcode"
            placeholder="cep"
            maxLength={8}
            defaultValue={contact.postcode ?? ""}
          />
          <Field
            name="city"
            placeholder="cidade"
            defaultValue={contact.city ?? ""}
          />
        </Row>
        <Row>
          <Field
            name="state"
            placeholder="estado"
            maxLength={2}
            defaultValue={contact.state ?? ""}
          />
          <Field
            name="address"
            placeholder="logradouro"
            defaultValue={contact.address ?? ""}
          />
        </Row>
      </Section>

      {/* Status */}
      <Section label="status">
        <label className="flex items-center gap-2 text-sm font-light normal-case cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={contact.is_active}
            className="accent-black"
          />
          ativo
        </label>
      </Section>

      {/* Notes */}
      <Section label="observações">
        <textarea
          name="notes"
          placeholder="anotações sobre o contato..."
          rows={3}
          defaultValue={contact.notes ?? ""}
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
      <p className="text-xs font-light text-tertiary/60 uppercase tracking-widest">
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
  maxLength,
  defaultValue,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        className="w-full h-full p-2 placeholder:text-tertiary/75 outline-none focus:border focus:border-tertiary focus:rounded-md"
      />
    </div>
  );
}

function SelectField({
  name,
  placeholder,
  defaultValue,
  children,
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 h-10 text-sm font-light rounded-md bg-background">
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
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
