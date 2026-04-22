import DateFilter from "@/components/dateFilters";
import ReceivableTable from "@/components/receivableTable";
import SearchInput from "@/components/searchInput";
import { getReceivables, PaymentStatus } from "@/lib/api/receivables";
import { isApiError } from "@/lib/api/types";
import { filterClass } from "@/lib/styleFilterButtons";
import buildFilterHref from "@/lib/utils/search-params";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FiadosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const { status, search, date, start_date, end_date } = resolvedParams;

  const isAll = !status && !search && !date && !start_date && !end_date;
  const isPending = status === "pending";
  const isOverdue = status === "overdue";
  const isPaid = status === "paid";
  const isPartiallyPaid = status === "partially_paid";
  const isToday = date === "today";
  const isWeek = date === "week";
  const isMonth = date === "month";

  const receivables = await getReceivables({
    type: "receivable",
    ...(typeof status === "string" && { status: status as PaymentStatus }),
    ...(typeof search === "string" && { search }),
    ...(typeof date === "string" && { date }),
    ...(typeof start_date === "string" && { start_date }),
    ...(typeof end_date === "string" && { end_date }),
  });

  if (isApiError(receivables)) {
    return <p>{receivables.message}</p>;
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">fiados</h1>

        <Link
          href={"fiados/novo"}
          className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
        >
          <Plus className="text-primary" size={16} />
        </Link>
      </div>

      <p className="mt-8 text-start text-lg font-light">histórico</p>

      {/* Filter Date Buttons */}
      <DateFilter endpoint="fiados" resolvedParams={resolvedParams} />
      <div className="overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-1 gap-6 font-bold items-center">
            <Link
              href="/fiados"
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isAll)}>tudo</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { date: "today" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isToday)}>hoje</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { date: "week" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isWeek)}>essa semana</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { date: "month" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isMonth)}>esse mês</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 mr-3">
        <SearchInput endpoint="fiados" />
      </div>

      {/* Filter Status Buttons */}
      <div className="flex w-full">
        <div className="ml-auto mt-4 mr-3 w-fit flex flex-col gap-3">
          <Link
            href={buildFilterHref(resolvedParams, { status: "pending" })}
            className="grid items-center justify-end shrink-0 rounded-md"
          >
            <p className={filterClass(isPending)}>pendente</p>
          </Link>
          <Link
            href={buildFilterHref(resolvedParams, { status: "overdue" })}
            className="grid items-center justify-end shrink-0 rounded-md"
          >
            <p className={filterClass(isOverdue)}>em atraso</p>
          </Link>
          <Link
            href={buildFilterHref(resolvedParams, {
              status: "partially_paid",
            })}
            className="grid items-center justify-end shrink-0 rounded-md"
          >
            <p className={filterClass(isPartiallyPaid)}>parcial</p>
          </Link>
          <Link
            href={buildFilterHref(resolvedParams, { status: "paid" })}
            className="grid items-center justify-end shrink-0 rounded-md"
          >
            <p className={filterClass(isPaid)}>pago</p>
          </Link>
        </div>
      </div>

      {/* Receivables History */}
      <ReceivableTable receivables={receivables} basePath="fiados" />
    </section>
  );
}
