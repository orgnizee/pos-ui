import BackButton from "@/components/back-button";
import { getCustomerByID } from "@/lib/api/customers";
import { getSupplierByID } from "@/lib/api/suppliers";
import { isApiError } from "@/lib/api/types";
import { formatCPF, formatCNPJ, formatPhone } from "@/lib/utils/format";
import type { Contact } from "@/lib/api/contacts";
import DeleteContactButton from "@/components/delete-contact-button";
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

  const dash = (v?: string | null) => (v && v.trim() !== "" ? v : "...");

  return (
    <section>
      <BackButton />

      <div className="flex flex-col mb-4 sm:mr-0 px-1 pt-1 items-center font-bold">
        <div className="relative mt-2 py-8 sm:py-0 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-full h-fit sm:w-140 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          {/* Kind */}
          <p className="absolute top-5 text-sm font-light text-tertiary">
            {contact.kind === "customer" ? "cliente" : "fornecedor"}
          </p>

          <Link
            href={`/contatos/${id}/editar`}
            className="absolute top-4.5 right-5 text-sm font-light normal-case text-primary/75 bg-secondary/20 rounded-full px-1.5 pt-0.5"
          >
            editar
          </Link>

          {/* Hero */}
          <div className="mt-10 sm:mt-15 flex flex-col items-center gap-1 mb-6">
            <p className="text-3xl font-bold">{fullName}</p>

            <p className="text-sm font-light normal-case text-tertiary">
              {displayName}
            </p>
          </div>

          {/* Details */}
          <div className="w-full sm:w-100">
            <Row label={documentLabel} value={document ?? "..."} first />

            <Row label="código" value={contact.code} />

            <Row
              label="telefone"
              value={contact.phone ? formatPhone(contact.phone) : "..."}
            />

            <Row label="e-mail" value={dash(contact.email)} />

            {contact.kind === "customer" && (
              <Row label="gênero" value={dash(contact.gender)} />
            )}

            {contact.kind === "supplier" && (
              <>
                <Row label="inscrição estadual" value={dash(contact.ie)} />
                <Row label="inscrição municipal" value={dash(contact.im)} />
              </>
            )}

            <Row label="cep" value={dash(contact.postcode)} />

            <Row label="endereço" value={dash(contact.address)} />

            <Row
              label="cidade"
              value={
                contact.city
                  ? `${contact.city}${contact.state ? ` — ${contact.state}` : ""}`
                  : "..."
              }
              last={!contact.notes}
            />

            {/* Notes becomes always visible too */}
            <div className="relative mt-4 w-full px-2 py-3 flex flex-col gap-1 rounded-md bg-secondary/15">
              <p className="text-sm font-light normal-case mb-1">observações</p>
              <p className="text-sm font-light normal-case text-tertiary">
                {dash(contact.notes)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-4 mb-1 text-sm font-light text-tertiary/60">
            {contact.id}
          </p>
        </div>
        <DeleteContactButton id={contact.id} kind={contact.kind} />
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  first,
  last,
}: {
  label: string;
  value: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`relative w-full h-5 px-2 py-5 flex items-center justify-between bg-secondary/15
        ${!last ? "border-b border-secondary/20" : ""}
        ${first ? "rounded-t-md" : ""}
        ${last ? "rounded-b-md" : ""}
      `}
    >
      <p className="text-sm font-light normal-case">{label}</p>
      <p className="text-sm font-light normal-case text-tertiary">{value}</p>
    </div>
  );
}
