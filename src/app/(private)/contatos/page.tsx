import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";
import { filterClass } from "@/lib/style-filter-buttons";
import SearchInput from "@/components/search-input";
import { Plus, Square } from "lucide-react";
import { getContacts, searchContacts, Contact } from "@/lib/api/contacts";
import { formatCPF, formatCNPJ, formatPhone } from "@/lib/utils/format";

export default async function ContatosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const { search, type } = resolvedParams;
  const isAll = !search && !type;
  const isCustomers = type === "customers";
  const isSuppliers = type === "suppliers";

  const allContacts =
    typeof search === "string" && search.length >= 3
      ? await searchContacts(search)
      : await getContacts();

  if (isApiError(allContacts)) {
    return <p>{allContacts.message}</p>;
  }

  const contacts = allContacts.filter((c) => {
    if (isCustomers) return c.kind === "customer";
    if (isSuppliers) return c.kind === "supplier";
    return true;
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-5xl sm:text-6xl normal-case">contatos</h1>
        <div className="flex gap-2 mr-0.5 sm:mr-6">
          <Link
            href={"contatos/adicionar"}
            className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
          >
            <Plus className="text-white" size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SearchInput endpoint="contatos" />
      </div>

      {/* Filter Buttons */}
      <div className="mt-2 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-5 gap-2 font-bold items-center">
            <Link
              href={"/contatos"}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isAll)}>todos</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { type: "customers" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isCustomers)}>clientes</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { type: "suppliers" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSuppliers)}>fornecedores</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="grid mt-0 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </section>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  const isCustomer = contact.kind === "customer";

  const displayName = isCustomer
    ? (contact.alias ?? "/")
    : (contact.trade_name ?? "/");
  const fullName = isCustomer ? contact.name : contact.legal_name;
  const document = isCustomer
    ? contact.cpf
      ? formatCPF(contact.cpf)
      : null
    : contact.cnpj
      ? formatCNPJ(contact.cnpj)
      : null;

  return (
    <div className="p-2 ring-1 ring-black/5 relative rounded-xl bg-background min-h-37.5 w-full">
      {/* Top row: phone pill + ID */}
      <div className="flex items-center justify-between h-7.5 w-full rounded-xl mb-1.5">
        <button className="bg-black/5 w-fit px-4 py-1 rounded-full">
          <p className="text-nowrap text-xs font-medium tracking-wide text-primary truncate">
            {contact.phone ? formatPhone(contact.phone) : ""}
          </p>
        </button>
        <div className="text-nowrap text-xs text-primary truncate">
          <p>{contact.code}</p>
        </div>
      </div>

      {/* Main card area */}
      <Link
        href={`/contatos/${contact.id}`}
        className="flex flex-col justify-between items-start bg-black/5 w-full h-32.5 rounded-xl"
      >
        <div className="px-3 py-2 w-full">
          <div className="text-black/30 mb-9">
            <Square size={16} fill="currentColor" strokeWidth={0} />
          </div>

          <p className="w-full text-start text-lg font-bold text-primary truncate">
            {fullName}
          </p>

          <div className="w-full text-xs text-start text-black/40">
            <span className="block truncate">{displayName}</span>
            <span className="block truncate">{document ?? "—"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
