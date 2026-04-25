import OrderCard from "@/components/orderCard";
import { filterClass } from "@/lib/styleFilterButtons";
import { getOrders, type OrderStatus } from "@/lib/api/orders";
import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";

const statusFilters: { label: string; value: "all" | OrderStatus }[] = [
  { label: "todos", value: "all" },
  { label: "abertas", value: "open" },
  { label: "pagas", value: "paid" },
  { label: "concluídas", value: "completed" },
  { label: "canceladas", value: "cancelled" },
];

export default async function VendasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const selectedStatus =
    typeof resolvedParams.status === "string"
      ? (resolvedParams.status as OrderStatus)
      : undefined;

  const allOrders = await getOrders();

  if (isApiError(allOrders)) {
    return <p>{allOrders.message}</p>;
  }

  const orders = allOrders
    .filter((order) => {
      if (!selectedStatus) return true;
      return order.status === selectedStatus;
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">vendas</h1>
      </div>

      <div className="mt-2 ml-1 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-5 gap-2 font-bold items-center">
            {statusFilters.map((filter) => {
              const isSelected =
                (filter.value === "all" && !selectedStatus) ||
                filter.value === selectedStatus;

              const href =
                filter.value === "all"
                  ? "/vendas"
                  : buildFilterHref(resolvedParams, { status: filter.value });

              return (
                <Link
                  key={filter.value}
                  href={href}
                  className="grid items-center justify-center shrink-0 rounded-md"
                >
                  <p className={filterClass(isSelected)}>{filter.label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid mt-0 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}
