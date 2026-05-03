import DateRange from "@/components/dateRangePicker";
import SearchInput from "@/components/searchInput";
import { getAccounts } from "@/lib/api/bankAccounts";
import { isApiError } from "@/lib/api/types";
import { filterClass } from "@/lib/styleFilterButtons";
import { formatBRL } from "@/lib/utils/format";
import buildFilterHref from "@/lib/utils/search-params";
import { Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { getPayables, PaymentStatus } from "@/lib/api/payables";
import PayableTable from "@/components/payableTable";
import MonthSelect from "@/components/monthSelector";

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const { status, search, date, start_date, end_date, page } =
    resolvedParams;

  const isAll = !status && !search && !date && !start_date && !end_date;
  const isPending = status === "pending";
  const isOverdue = status === "overdue";
  const isPaid = status === "paid";
  const isPartiallyPaid = status === "partially_paid";
  const isToday = date === "today";
  const isWeek = date === "week";

  const [payables, accounts] = await Promise.all([
    getPayables({
      type: "payable",
      ...(typeof status === "string" && { status: status as PaymentStatus }),
      ...(typeof search === "string" && { search }),
      ...(typeof date === "string" && { date }),
      ...(typeof start_date === "string" && { start_date }),
      ...(typeof end_date === "string" && { end_date }),
      ...(typeof page === "string" && { page }),
    }),
    getAccounts(),
  ]);

  if (isApiError(payables)) {
    return <p>{payables.message}</p>;
  }

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="sm:text-8xl text-5xl font-light">pagar</h1>

        <Link
          href={"pagamentos/novo"}
          className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
        >
          <Plus className="text-primary" size={16} />
        </Link>
      </div>

      <p className="mt-8 text-start text-lg font-light">histórico</p>

      {/* Filter Date Buttons */}
      <div className="flex gap-6">
        <DateRange />
        <div className="overflow-hidden">
          <div className="overflow-auto flex">
            <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-1 gap-6 font-bold items-center">
              <Link
                href="/pagamentos"
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

              <MonthSelect endpoint="pagamentos" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 mr-3">
        <SearchInput endpoint="pagamentos" />
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
      <PayableTable
        payables={payables.results.map((p) => p.payment)}
        basePath="pagamentos"
        accounts={accounts}
      />

      <Pagination count={payables.count} />

      <div className="mt-6 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex w-full justify-between px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <SummaryCard label="total" value={payables.total} />
            <SummaryCard
              label="em atraso"
              value={payables.total_overdue}
              highlight="red"
            />
            <SummaryCard
              label="pago"
              value={payables.total_paid}
              highlight="green"
            />
            <SummaryCard label="a pagar" value={payables.total_to_be_paid} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
  highlight?: "red" | "green" | "orange";
}) {
  return (
    <div className="grid items-center justify-center shrink-0 rounded-md overflow-hidden">
      <p className={`text-center text-xs uppercase font-light`}>{label}</p>
      <p
        className={`w-40 h-fit py-0.5 rounded-md text-center font-medium text-lg uppercase`}
      >
        {formatBRL(value)}
      </p>
    </div>
  );
}
