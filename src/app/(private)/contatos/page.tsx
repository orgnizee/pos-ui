import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";
import { filterClass } from "@/lib/styleFilterButtons";
import SearchInput from "@/components/searchInput";
import { Plus} from "lucide-react";
import { getContacts, searchContacts} from "@/lib/api/contacts";
import ContactCard from "@/components/contactCard";

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
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">contatos</h1>

        <Link
          href={"contatos/novo"}
          className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
        >
          <Plus className="text-primary" size={16} />
        </Link>
      </div>

      <div className="flex justify-end mt-8">
        <SearchInput endpoint="contatos" />
      </div>

      {/* Filter Buttons */}
      <div className="mt-2 ml-1 overflow-hidden">
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
        {contacts
          .filter((contact) => contact.is_active)
          .map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
      </div>
    </section>
  );
}