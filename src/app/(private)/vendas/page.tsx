import { getOrders } from "@/lib/api/orders";
import { filterClass } from "@/lib/style-filter-buttons";
import Link from "next/link";
import type { OrderStatus } from "@/lib/api/orders";
import buildFilterHref from "@/lib/utils/search-params";
import { OrderRow } from "@/components/orders-row";
import Pagination from "@/components/pagination";
import { isApiError } from "@/lib/api/types";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "open", label: "Aberto" },
  { value: "paid", label: "Pago" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

interface Props {
  searchParams: Promise<{
    status?: OrderStatus;
    date_after?: string;
    date_before?: string;
    customer?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const filters = await searchParams;
  const data = await getOrders(filters);

  if (isApiError(data)) {
    return <p className="">{data.message}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Pedidos</h1>
        <Link
          href="/orders/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Novo pedido
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <Link
        href={buildFilterHref(filters, { status: undefined })}
        className={filterClass(!filters.status)}
        >
        Todos
        </Link>
        {STATUSES.map(({ value, label }) => (
          <Link
            key={value}
            href={buildFilterHref(filters, { status: undefined })}
            className={filterClass(filters.status === value)}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Date range */}
      <div className="flex gap-2 items-center">
        <label className="text-xs text-zinc-500">De</label>
        {/* Controlled via form — use your existing DateFilter component */}
        <input
          type="date"
          name="date_after"
          defaultValue={filters.date_after}
          className="rounded-lg border border-tertiary bg-background px-3 py-1.5 text-sm text-zinc-700"
        />
        <label className="text-xs text-zinc-500">até</label>
        <input
          type="date"
          name="date_before"
          defaultValue={filters.date_before}
          className="rounded-lg border border-tertiary bg-background px-3 py-1.5 text-sm text-zinc-700"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {data.results.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-12">
            Nenhum pedido encontrado.
          </p>
        ) : (
          data.results.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>

      <Pagination count={data.count} />
    </div>
  );
}
