import { DeleteOrderButton } from "@/components/delete-order-button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getOrder } from "@/lib/api/orders";
import { isApiError } from "@/lib/api/types";
import { formatBRL } from "@/lib/utils/format";
import { formatDateTime } from "@/lib/utils/format";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (isApiError(order)) {
    return <p className="">{order.message}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-zinc-800">
            Pedido #{order.order_number}
          </h1>
          <span className="text-xs text-zinc-400">
            {formatDateTime(order.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <Link
            href={`/orders/${id}/edit`}
            className="rounded-lg border border-tertiary px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Editar
          </Link>
          <DeleteOrderButton id={id} />
        </div>
      </div>

      {/* Info */}
      <section className="rounded-xl border border-tertiary bg-background p-4 flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-700">Informações</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-zinc-400">Cliente</span>
            <p className="text-zinc-700">{order.customer.name}</p>
          </div>
          <div>
            <span className="text-xs text-zinc-400">Operador</span>
            <p className="text-zinc-700">{order.operator.name}</p>
          </div>
          <div>
            <span className="text-xs text-zinc-400">Data do pedido</span>
            <p className="text-zinc-700">
              {new Date(order.order_date).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}
            </p>
          </div>
          {order.category_name && (
            <div>
              <span className="text-xs text-zinc-400">Categoria</span>
              <p className="text-zinc-700">{order.category_name}</p>
            </div>
          )}
          {order.notes && (
            <div className="col-span-2">
              <span className="text-xs text-zinc-400">Observações</span>
              <p className="text-zinc-700">{order.notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="rounded-xl border border-tertiary bg-background p-4 flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-700">Itens</h2>
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex flex-col">
                <span className="text-zinc-700 font-medium">
                  {item.product_name}
                </span>
                <span className="text-xs text-zinc-400">
                  {item.quantity} {item.unit} × {formatBRL(item.price)}
                </span>
              </div>
              <span className="text-zinc-800 font-medium">
                {formatBRL(item.total)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Payments */}
      <section className="rounded-xl border border-tertiary bg-background p-4 flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-700">Pagamentos</h2>
        <div className="flex flex-col gap-2">
          {order.payment_methods?.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex flex-col">
                <span className="text-zinc-700 font-medium">
                  {p.method.description}
                </span>
                <span className="text-xs text-zinc-400">
                  Vencimento:{" "}
                  {new Date(p.due_at).toLocaleDateString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </span>
              </div>
              <span className="text-zinc-800 font-medium">
                {formatBRL(p.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <section className="rounded-xl border border-tertiary bg-background p-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-zinc-500">
          <span>Subtotal</span>
          <span>{formatBRL(order.subtotal)}</span>
        </div>
        {Number(order.discount_amount) > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Desconto</span>
            <span>- {formatBRL(order.discount_amount)}</span>
          </div>
        )}
        {Number(order.ipi_amount) > 0 && (
          <div className="flex justify-between text-zinc-500">
            <span>IPI</span>
            <span>{formatBRL(order.ipi_amount)}</span>
          </div>
        )}
        {Number(order.icms_amount) > 0 && (
          <div className="flex justify-between text-zinc-500">
            <span>ICMS</span>
            <span>{formatBRL(order.icms_amount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-zinc-800 border-t border-tertiary pt-2 mt-1">
          <span>Total</span>
          <span>{formatBRL(order.total_amount)}</span>
        </div>
      </section>
    </div>
  );
}
