import Link from "next/link";
import type { OrderListItem } from "@/lib/api/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { formatBRL } from "@/lib/utils/format";

export function OrderRow({ order }: { order: OrderListItem }) {
  const date = new Date(order.order_date).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  return (
    <Link
      href={`/vendas/${order.id}`}
      className="flex items-center justify-between rounded-xl border border-tertiary bg-background px-4 py-3 hover:bg-zinc-50 transition-colors"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-zinc-800">
          #{order.order_number}
        </span>
        <span className="text-xs text-zinc-500">{order.customer_name}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-xs text-zinc-400">{date}</span>
        <OrderStatusBadge status={order.status} />
        <span className="text-sm font-medium text-zinc-800">
          {formatBRL(order.total_amount)}
        </span>
      </div>
    </Link>
  );
}
