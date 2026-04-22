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
import { InputField } from "./inputField";
import { SelectInputField } from "./inputFieldSelect";
import MaskedInput from "./maskedInput";
import { formatCNPJ, formatCPF, formatPhone } from "@/lib/utils/format";
import { InputTextareaField } from "./inputTextAreaField";

type ContactType = "customer" | "supplier";
type ActionState = CustomerActionState | SupplierActionState;

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

export default function ContactForm() {
  const [type, setType] = useState<ContactType>("customer");

  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_, formData) => {
      const contactType = formData.get("type") as ContactType;
      if (contactType === "customer") return createCustomerAction(_, formData);
      return createSupplierAction(_, formData);
    },
    null,
  );

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      <input type="hidden" name="type" value={type} />

      {/* Type toggle */}
      <div className="mb-10 flex gap-2">
        {(["customer", "supplier"] as ContactType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-2 py-0.5 text-sm uppercase transition-colors ${
              type === t
                ? "border text-primary"
                : "text-tertiary cursor-pointer"
            }`}
          >
            {t === "customer" ? "cliente" : "fornecedor"}
          </button>
        ))}
      </div>

      {/* Identificação */}
      <div className="mb-8">
        <SectionLabel label="identificação" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          {type === "customer" ? (
            <InputField label="nome" name="name" required autoFocus />
          ) : (
            <InputField label="razão social" name="legal_name" required autoFocus />
          )}

          {type === "customer" ? (
            <InputField label="apelido" name="alias" />
          ) : (
            <InputField label="nome fantasia" name="trade_name" />
          )}

          {type === "customer" ? (
            <MaskedInput label="cpf" name="cpf" formatter={formatCPF} />
          ) : (
            <MaskedInput label="cnpj" name="cnpj" formatter={formatCNPJ} />
          )}

          {type === "customer" && (
            <SelectInputField
              label="gênero"
              name="gender"
              options={[
                { label: "MASCULINO", value: "male" },
                { label: "FEMININO", value: "female" },
                { label: "NÃO INFORMADO", value: "unknown" },
              ]}
            />
          )}

          {type === "supplier" && (
            <>
              <InputField label="inscrição estadual" name="ie" />
              <InputField label="inscrição municipal" name="im" />
            </>
          )}
        </div>
      </div>

      {/* Contato */}
      <div className="mb-8">
        <SectionLabel label="contato" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <MaskedInput label="celular" name="phone" formatter={formatPhone} />
          <InputField label="e-mail" name="email" type="email" />
        </div>
      </div>

      {/* Endereço */}
      <div className="mb-8">
        <SectionLabel label="endereço" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          <InputField label="cep" name="postcode" maxLength={8} />
          <InputField label="cidade" name="city" />
          <InputField label="estado" name="state" maxLength={2} />
          <InputField label="logradouro" name="address" />
        </div>
      </div>

      {/* Observações */}
      <div className="mb-8">
        <SectionLabel label="observações" />
        <InputTextareaField
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