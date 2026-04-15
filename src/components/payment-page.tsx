import { getPayments } from "@/lib/api/payments";
import { isApiError } from "@/lib/api/types";
import { formatBRL } from "@/lib/utils/format";
import buildFilterHref from "@/lib/utils/search-params";
import { filterClass } from "@/lib/style-filter-buttons";
import SearchInput from "@/components/search-input";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Payment, PaymentStatus, PaymentType } from "@/lib/api/payments";
import PaymentRow from "./payment-row";
import DateFilter from "./date-filters";

interface PaymentsPageProps {
  paymentType: PaymentType;
  resolvedParams: { [key: string]: string | string[] | undefined };
}

export default async function PaymentsPage({
  paymentType,
  resolvedParams,
}: PaymentsPageProps) {
  const { status, search, date, start_date, end_date } = resolvedParams;

  const isAll = !status && !search && !date && !start_date && !end_date;
  const isPending = status === "pending";
  const isOverdue = status === "overdue";
  const isPaid = status === "paid";
  const isPartiallyPaid = status === "partially_paid";
  const isToday = date === "today";
  const isWeek = date === "week";
  const isMonth = date === "month";

  const payments = await getPayments({
    type: paymentType,
    ...(typeof status === "string" && { status: status as PaymentStatus }),
    ...(typeof search === "string" && { search }),
    ...(typeof date === "string" && { date }),
    ...(typeof start_date === "string" && { start_date }),
    ...(typeof end_date === "string" && { end_date }),
  });

  if (isApiError(payments)) {
    return <p>{payments.message}</p>;
  }

  const byStatus = (s: PaymentStatus) => payments.filter((p) => p.status === s);

  const sumOutstanding = (list: Payment[]) =>
    list
      .reduce((sum, p) => sum + parseFloat(p.outstanding_balance), 0)
      .toFixed(2);

  const sumPaid = (list: Payment[]) =>
    list.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0).toFixed(2);

  const basePath = paymentType === "payable" ? "/pagar" : "/receber";
  const title = paymentType === "payable" ? "a pagar" : "a receber";

  return (
    <section className="mr-4 sm:mr-8">
      <div className="flex items-center justify-between sm:mr-2">
        <h1 className="text-5xl sm:text-6xl normal-case">{title}</h1>
        <Link
          href={`${basePath}/adicionar`}
          className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
        >
          <Plus className="text-white" size={16} />
        </Link>
      </div>

      {/* Status Summary Cards */}
      <div className="mt-8 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <SummaryCard
              key={"asdfklsdx"}
              label="pendente"
              value={sumOutstanding(byStatus("pending"))}
            />
            <SummaryCard
              key={"asdfklsdxy"}
              label="em atraso"
              value={sumOutstanding(byStatus("overdue"))}
              highlight="red"
            />
            <SummaryCard
              key={"asdfklsdxz"}
              label="parcial"
              value={sumOutstanding(byStatus("partially_paid"))}
              highlight="orange"
            />
            <SummaryCard
              key={"asdfklsdxu"}
              label="pago"
              value={sumPaid(byStatus("paid"))}
              highlight="green"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SearchInput endpoint={basePath.replace("/", "")} />
      </div>

      {/* Date + Filters Row */}
      <div className="mt-2 mb-2 flex items-center gap-3">
        {/* Fixed DateFilter */}
        <div className="shrink-0">
          <DateFilter endpoint="receber" resolvedParams={resolvedParams} />
        </div>
        {/* Scrollable Filter Buttons */}
        <div className="overflow-hidden">
          <div className="overflow-auto flex">
            <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-1 gap-2 font-bold items-center">
              <Link
                href={basePath}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isAll)}>tudo</p>
              </Link>
              <Link
                href={buildFilterHref(resolvedParams, { status: "pending" })}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isPending)}>pendente</p>
              </Link>
              <Link
                href={buildFilterHref(resolvedParams, { status: "overdue" })}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isOverdue)}>em atraso</p>
              </Link>
              <Link
                href={buildFilterHref(resolvedParams, {
                  status: "partially_paid",
                })}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isPartiallyPaid)}>parcial</p>
              </Link>
              <Link
                href={buildFilterHref(resolvedParams, { status: "paid" })}
                className="grid items-center justify-center shrink-0 rounded-md"
              >
                <p className={filterClass(isPaid)}>pago</p>
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

      {/* Payment List */}
      <section className="sm:mr-8 w-full">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed border-separate border-spacing-y-2">
            <colgroup>
              <col className="w-full sm:w-6" />
              <col className="hidden sm:table-column sm:w-28" />
              <col className="hidden sm:table-column w-46" />
              <col className="hidden sm:table-column w-28" />
              <col className="hidden sm:table-column sm:w-36" />
              <col className="hidden sm:table-column" />
            </colgroup>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-sm font-light text-tertiary normal-case py-2 px-1.5"
                  >
                    nenhum pagamento encontrado.
                  </td>
                </tr>
              )}
              {payments
                .filter((p): p is Payment => Boolean(p))
                .map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    basePath={basePath}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

// ── Summary Card ──────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "red" | "green" | "orange";
}) {
  const color =
    highlight === "red"
      ? "text-red-500"
      : highlight === "green"
        ? "text-green-600"
        : highlight === "orange"
          ? "text-orange-400"
          : "text-primary";

  return (
    <div className="grid items-center justify-center shrink-0 rounded-md overflow-hidden">
      <p className="text-center text-sm normal-case font-light">{label}</p>
      <p
        className={`w-40 h-fit px-1 py-0.5 pt-1 rounded-md text-center text-sm normal-case bg-secondary/20 ${color}`}
      >
        {formatBRL(value)}
      </p>
    </div>
  );
}
