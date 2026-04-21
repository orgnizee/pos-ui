import type { OrderStatus } from "@/lib/api/orders";

const config: Record<OrderStatus, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-zinc-100 text-zinc-600" },
  open: { label: "Aberto", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Pago", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-600" },
  refunded: { label: "Reembolsado", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Concluído", className: "bg-green-100 text-green-700" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
