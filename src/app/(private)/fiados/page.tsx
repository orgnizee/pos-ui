import DateRange from "@/components/dateRangePicker";
import ReceivableTable from "@/components/receivableTable";
import SearchInput from "@/components/searchInput";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getReceivables, PaymentStatus } from "@/lib/api/receivables";
import { isApiError } from "@/lib/api/types";
import { filterClass } from "@/lib/styleFilterButtons";
import { formatBRL } from "@/lib/utils/format";
import buildFilterHref from "@/lib/utils/search-params";
import { Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/pagination";
import MonthSelect from "@/components/monthSelector";

export default async function FiadosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const { status, search, date, start_date, end_date, sort, page } =
    resolvedParams;

  const normalizedSort =
    typeof sort === "string" ? sort : Array.isArray(sort) ? sort[0] : "";

  const isAll = !status && !search && !date && !start_date && !end_date;
  const isPending = status === "pending";
  const isOverdue = status === "overdue";
  const isPaid = status === "paid";
  const isPartiallyPaid = status === "partially_paid";
  const isToday = date === "today";
  const isWeek = date === "week";
  const currentSort = typeof sort === "string" ? sort : "issued";
  const isSortByIssued = currentSort === "issued";
  const isSortByDueDate = currentSort === "due";
  const currentPage =
    typeof page === "string" && Number(page) > 0 ? Number(page) : 1;
  const pageSize = 50;

  const [receivables, accounts] = await Promise.all([
    getReceivables({
      type: "receivable",
      ...(typeof status === "string" && { status: status as PaymentStatus }),
      ...(typeof search === "string" && { search }),
      ...(typeof date === "string" && { date }),
      ...(typeof start_date === "string" && { start_date }),
      ...(typeof end_date === "string" && { end_date }),
      ...(typeof sort === "string" && { sort }),
    }),
    getAccounts(),
  ]);

  if (isApiError(receivables)) {
    return <p>{receivables.message}</p>;
  }

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  const sortedReceivables = [...receivables].sort((a, b) => {
    if (isSortByDueDate) {
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    }

    return new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime();
  });
  const pagedReceivables = sortedReceivables.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const byStatus = (paymentStatus: PaymentStatus) =>
    sortedReceivables.filter(
      (receivable) => receivable.status === paymentStatus,
    );

  const sumOutstanding = (status: PaymentStatus) =>
    byStatus(status)
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.outstanding_balance),
        0,
      )
      .toFixed(2);

  const sumTotalAmount = () =>
    sortedReceivables
      .reduce((sum, receivable) => sum + parseFloat(receivable.total_amount), 0)
      .toFixed(2);

  const sumTotalOutstanding = () =>
    sortedReceivables
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.outstanding_balance),
        0,
      )
      .toFixed(2);

  const sumTotalPaid = () =>
    sortedReceivables
      .reduce((sum, receivable) => sum + parseFloat(receivable.amount_paid), 0)
      .toFixed(2);

  // const sumPaid = (status: PaymentStatus) =>
  //   byStatus(status)
  //     .reduce((sum, receivable) => sum + parseFloat(receivable.amount_paid), 0)
  //     .toFixed(2);

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="sm:text-8xl text-6xl sm:ml-0 -ml-1 font-light">
          fiados
        </h1>

        <Link
          href={"fiados/novo"}
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

              <MonthSelect endpoint="fiados" />
            </div>
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

      <div className="mt-0 overflow-hidden">
        <div className="overflow-auto flex justify-start">
          <div className="overflow-x-auto scrollbar-hidden flex pb-5 gap-2 font-bold items-center">
            <p className="text-xs text-primary/50 shrink-0">ordenar por</p>
            <Link
              href={"/fiados?sort=issued"}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSortByIssued)}>emissão</p>
            </Link>
            <Link
              href={"/fiados?sort=due"}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSortByDueDate)}>vencimento</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Receivables History */}
      <ReceivableTable
        receivables={pagedReceivables}
        basePath="fiados"
        accounts={accounts}
        order={normalizedSort}
      />

      <Pagination count={sortedReceivables.length} pageSize={pageSize} />

      <div className="mt-6 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex w-full justify-between px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <SummaryCard label="total" value={sumTotalAmount()} />
            <SummaryCard
              label="em atraso"
              value={sumOutstanding("overdue")}
              highlight="red"
            />
            <SummaryCard
              label="pago"
              value={sumTotalPaid()}
              highlight="green"
            />
            <SummaryCard label="a pagar" value={sumTotalOutstanding()} />
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
