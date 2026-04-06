import { getTransactions } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";
import { filterClass } from "@/lib/style-filter-buttons";
import SearchInput from "@/components/search-input";
import { Plus } from "lucide-react";

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

  const transactions = await getTransactions({
    ...(typeof search === "string" && { search }),
    ...(typeof type === "string" && { type }),
  });

  if (isApiError(transactions)) {
    return <p>{transactions.message}</p>;
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-5xl sm:text-6xl normal-case">contatos</h1>

        {/* Add Contact Button */}
        <div className="flex gap-2 mr-0.5 sm:mr-6">
          <Link
            href={"caixa/entrada"}
            className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
          >
            <Plus className="text-white" size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SearchInput />
      </div>

      {/* Filter Buttons */}
      <div className="mt-2 mb-10 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-5 gap-2 font-bold items-center">
            <Link
              href={"/caixa"}
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
      <div className="">
        
      </div>
    </section>
  );
}
