import type { Order } from "@/lib/api/orders";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";

const statusLabel: Record<Order["status"], string> = {
  draft: "rascunho",
  open: "aberta",
  paid: "paga",
  cancelled: "cancelada",
  refunded: "estornada",
  completed: "concluída",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/vendas/${order.id}`}
      className="border border-primary hover:border-tertiary p-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">venda {order.order_number}</p>
        <p className="text-xs uppercase">{statusLabel[order.status]}</p>
      </div>

      <p className="text-lg font-light truncate">{order.customer.name}</p>

      <div className="flex items-center justify-between text-xs text-tertiary">
        <p>{formatDateTime(order.order_date)}</p>
        <p>{formatBRL(order.total_amount)}</p>
      </div>
    </Link>
  );
}
