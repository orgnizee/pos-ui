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

  const [receivables, accounts] = await Promise.all([
    getReceivables({
      type: "receivable",
      ...(typeof status === "string" && { status: status as PaymentStatus }),
      ...(typeof search === "string" && { search }),
      ...(typeof date === "string" && { date }),
      ...(typeof start_date === "string" && { start_date }),
      ...(typeof end_date === "string" && { end_date }),
    }),
    getAccounts(),
  ]);

  if (isApiError(receivables)) {
    return <p>{receivables.message}</p>;
  }

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  const byStatus = (paymentStatus: PaymentStatus) =>
    receivables.filter((receivable) => receivable.status === paymentStatus);

  const sumOutstanding = (status: PaymentStatus) =>
    byStatus(status)
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.outstanding_balance),
        0,
      )
      .toFixed(2);

  const sumTotalAmount= () =>
    receivables
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.total_amount),
        0,
      )
      .toFixed(2);

  const sumTotalOutstanding= () =>
    receivables
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.outstanding_balance),
        0,
      )
      .toFixed(2);

  const sumTotalPaid= () =>
    receivables
      .reduce(
        (sum, receivable) => sum + parseFloat(receivable.amount_paid),
        0,
      )
      .toFixed(2);

  // const sumPaid = (status: PaymentStatus) =>
  //   byStatus(status)
  //     .reduce((sum, receivable) => sum + parseFloat(receivable.amount_paid), 0)
  //     .toFixed(2);

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
              <Link
                href={buildFilterHref(resolvedParams, { date: "month" })}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isMonth)}>esse mês</p>
              </Link>
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

      {/* Receivables History */}
      <ReceivableTable
        receivables={receivables}
        basePath="fiados"
        accounts={accounts}
      />

      <div className="mt-6 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex w-full justify-between px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <SummaryCard label="total" value={sumTotalAmount()} />
            <SummaryCard
              label="em atraso"
              value={sumOutstanding("overdue")}
              highlight="red"
            />
            <SummaryCard label="pago" value={sumTotalPaid()} highlight="green" />
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
