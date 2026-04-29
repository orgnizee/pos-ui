import OrderCard from "@/components/orderCard";
import { filterClass } from "@/lib/styleFilterButtons";
import { getOrders, type OrderStatus } from "@/lib/api/orders";
import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/searchInput";
import DateRange from "@/components/dateRangePicker";

const statusFilters: { label: string; value: "all" | OrderStatus }[] = [
  { label: "todas", value: "all" },
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
  const { search, date, start_date, end_date } = resolvedParams;

  const currentSort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "recent";
  const isSortByRecent = currentSort === "recent";
  const isSortByOldest = currentSort === "oldest";
  const isSortByTotal = currentSort === "total";
  const currentPage =
    typeof resolvedParams.page === "string" && Number(resolvedParams.page) > 0
      ? Number(resolvedParams.page)
      : 1;
  const pageSize = 50;
  const selectedStatus =
    typeof resolvedParams.status === "string"
      ? (resolvedParams.status as OrderStatus)
      : undefined;

  const allOrders = await getOrders({
    search:
      typeof search === "string" && search.length >= 3 ? search : undefined,
    date: typeof date === "string" ? date : undefined,
    start_date: typeof start_date === "string" ? start_date : undefined,
    end_date: typeof end_date === "string" ? end_date : undefined,
  });

  if (isApiError(allOrders)) {
    return <p>{allOrders.message}</p>;
  }

  const sortedOrders = allOrders
    .filter((order) => {
      if (!selectedStatus) return true;
      return order.status === selectedStatus;
    })
    .sort((a, b) => {
      if (isSortByOldest) {
        return a.created_at.localeCompare(b.created_at);
      }

      if (isSortByTotal) {
        return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      }

      return b.created_at.localeCompare(a.created_at);
    });
  const pagedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">vendas</h1>
      </div>

      <p className="mt-8 text-start text-lg font-light">histórico</p>

      {/* Order Buttons */}
      <div className="flex gap-6">
        <DateRange />
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pb-0 gap-6 font-bold items-center">
            <p className="text-xs text-primary/50 shrink-0">ordenar por</p>
            <Link
              href={buildFilterHref(resolvedParams, { sort: "recent" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSortByRecent)}>recentes</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { sort: "oldest" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSortByOldest)}>antigas</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { sort: "total" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isSortByTotal)}>valor</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <SearchInput endpoint="vendas" />
      </div>

      {/* Filter Status Buttons */}
      <div className="flex w-full">
        <div className="ml-auto mt-4 mr-0 w-fit flex flex-col gap-3">
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
                className="grid items-center justify-end shrink-0 rounded-md"
              >
                <p className={filterClass(isSelected)}>{filter.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid mt-8 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1">
        {pagedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <Pagination count={sortedOrders.length} pageSize={pageSize} />
    </section>
  );
}
