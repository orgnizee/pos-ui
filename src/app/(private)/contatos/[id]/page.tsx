import BackButton from "@/components/backButton";
import { getCustomerByID } from "@/lib/api/customers";
import { getSupplierByID } from "@/lib/api/suppliers";
import { isApiError } from "@/lib/api/types";
import { formatCPF, formatCNPJ, formatPhone } from "@/lib/utils/format";
import type { Contact } from "@/lib/api/contacts";
import DeleteContactButton from "@/components/deleteContactButton";
import Link from "next/link";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await getCustomerByID(id);
  let contact: Contact;

  if (!isApiError(customer)) {
    contact = { ...customer, kind: "customer" };
  } else {
    const supplier = await getSupplierByID(id);
    if (isApiError(supplier)) {
      return <p>{supplier.message}</p>;
    }
    contact = { ...supplier, kind: "supplier" };
  }

  const displayName =
    contact.kind === "customer"
      ? (contact.alias ?? "/")
      : (contact.trade_name ?? "/");

  const fullName =
    contact.kind === "customer" ? contact.name : contact.legal_name;

  const document =
    contact.kind === "customer"
      ? contact.cpf
        ? formatCPF(contact.cpf)
        : null
      : contact.cnpj
        ? formatCNPJ(contact.cnpj)
        : null;

  const documentLabel = contact.kind === "customer" ? "cpf" : "cnpj";

  const dash = (v?: string | null) => (v && v.trim() !== "" ? v : "-");

  return (
    <section className="mt-6 mb-4">
      <div className="mt-6 mb-4 flex items-center justify-between">
        <BackButton />

        <Link
          href={`/contatos/${contact.id}/editar`}
          className="text-xs cursor-pointer mr-2"
        >
          editar
        </Link>
      </div>

      <div className="flex flex-col px-1 pt-1 items-center">
        <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-fit border">
          {/* Kind */}
          <p className="absolute top-5 text-sm font-normal">
            {contact.kind === "customer" ? "cliente" : "fornecedor"}
          </p>

          {/* Hero */}
          <p className="mt-10 sm:mt-12 text-4xl text-center">{fullName}</p>
          <p className="mt-2">{displayName}</p>

          <div className="mt-5 w-fit h-fit border-b border-secondary/50">
            <p className="py-0.5 text-[12px]">{contact.code}</p>
          </div>

          {/* Details */}
          <div className="relative w-full sm:w-100 h-5 mt-8 py-4 flex items-center justify-between">
            <p className="text-sm font-light">{documentLabel}</p>
            <p className="text-sm font-light">{document ?? "-"}</p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">telefone</p>
            <p className="text-sm font-light">
              {contact.phone ? formatPhone(contact.phone) : "-"}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">e-mail</p>
            <p className="text-sm font-light">{dash(contact.email)}</p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          {contact.kind === "customer" && (
            <>
              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">gênero</p>
                <p className="text-sm font-light">{dash(contact.gender)}</p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />
            </>
          )}

          {contact.kind === "supplier" && (
            <>
              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">inscrição estadual</p>
                <p className="text-sm font-light">{dash(contact.ie)}</p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />

              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">inscrição municipal</p>
                <p className="text-sm font-light">{dash(contact.im)}</p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />
            </>
          )}

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">cep</p>
            <p className="text-sm font-light">{dash(contact.postcode)}</p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">endereço</p>
            <p className="text-sm font-light">{dash(contact.address)}</p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">cidade</p>
            <p className="text-sm font-light">
              {contact.city
                ? `${contact.city}${contact.state ? ` — ${contact.state}` : ""}`
                : "-"}
            </p>
          </div>

          {/* Notes */}
          <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1">
            <p className="text-sm text-center font-light">
              {contact.notes ? `"${contact.notes.toLowerCase()}"` : "-"}
            </p>
          </div>
        </div>
      </div>
      <DeleteContactButton id={contact.id} kind={contact.kind} />
    </section>
  );
}
