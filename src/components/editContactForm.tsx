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
import { InputField } from "./inputField";
import { SelectInputField } from "./inputFieldSelect";
import MaskedInput from "./maskedInput";
import { formatCPF, formatCNPJ, formatPhone } from "@/lib/utils/format";
import { InputTextareaField } from "./inputTextAreaField";

type ActionState = CustomerActionState | SupplierActionState;

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

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

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      {/* Identificação */}
      <div className="mb-8">
        <SectionLabel label="identificação" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          {contact.kind === "customer" ? (
            <InputField
              label="nome"
              name="name"
              defaultValue={contact.name}
              required
              autoFocus
            />
          ) : (
            <InputField
              label="razão social"
              name="legal_name"
              defaultValue={contact.legal_name}
              required
              autoFocus
            />
          )}

          {contact.kind === "customer" ? (
            <InputField
              label="apelido"
              name="alias"
              defaultValue={contact.alias ?? ""}
            />
          ) : (
            <InputField
              label="nome fantasia"
              name="trade_name"
              defaultValue={contact.trade_name ?? ""}
            />
          )}

          {contact.kind === "customer" ? (
            <MaskedInput
              label="cpf"
              name="cpf"
              formatter={formatCPF}
              defaultValue={contact.cpf ?? ""}
            />
          ) : (
            <MaskedInput
              label="cnpj"
              name="cnpj"
              formatter={formatCNPJ}
              defaultValue={contact.cnpj ?? ""}
            />
          )}

          {contact.kind === "customer" && (
            <SelectInputField
              label="gênero"
              name="gender"
              defaultValue={contact.gender ?? ""}
              options={[
                { label: "MASCULINO", value: "male" },
                { label: "FEMININO", value: "female" },
                { label: "NÃO INFORMADO", value: "unknown" },
              ]}
            />
          )}

          {contact.kind === "supplier" && (
            <>
              <InputField
                label="inscrição estadual"
                name="ie"
                defaultValue={contact.ie ?? ""}
              />
              <InputField
                label="inscrição municipal"
                name="im"
                defaultValue={contact.im ?? ""}
              />
            </>
          )}
        </div>
      </div>

      {/* Contato */}
      <div className="mb-8">
        <SectionLabel label="contato" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <MaskedInput
            label="celular"
            name="phone"
            formatter={formatPhone}
            defaultValue={contact.phone ?? ""}
          />
          <InputField
            label="e-mail"
            name="email"
            type="email"
            defaultValue={contact.email ?? ""}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="mb-8">
        <SectionLabel label="endereço" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          <InputField
            label="cep"
            name="postcode"
            maxLength={8}
            defaultValue={contact.postcode ?? ""}
          />
          <InputField
            label="cidade"
            name="city"
            defaultValue={contact.city ?? ""}
          />
          <InputField
            label="estado"
            name="state"
            maxLength={2}
            defaultValue={contact.state ?? ""}
          />
          <InputField
            label="logradouro"
            name="address"
            defaultValue={contact.address ?? ""}
          />
        </div>
      </div>

      {/* Status */}
      <div className="mb-8">
        <SectionLabel label="status" />
        <label className="mt-4 flex items-center gap-2 text-sm font-light cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={contact.is_active}
            className="appearance-none w-4 h-4 border border-primary rounded-none cursor-pointer relative checked:bg-primary checked:border-primary checked:after:content-[''] checked:after:absolute checked:after:top-0.5 checked:after:left-1.25 checked:after:w-1 checked:after:h-2 checked:after:border checked:after:border-white checked:after:border-t-0 checked:after:border-l-0 checked:after:rotate-45"
          />
          ativo
        </label>
      </div>

      {/* Observações */}
      <div className="mb-8">
        <SectionLabel label="observações" />
        <InputTextareaField
          label=""
          name="notes"
          rows={3}
          defaultValue={contact.notes ?? ""}
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
