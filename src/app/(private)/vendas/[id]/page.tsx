import BackButton from "@/components/backButton";
import DeleteOrderButton from "@/components/deleteOrderButton";
import PrintOrderReceipt from "@/components/printOrderReceipt";
import PrintOrderReceiptButton from "@/components/printOrderReceiptButton";
import { getOrderByID } from "@/lib/api/orders";
import { isApiError } from "@/lib/api/types";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";

const statusLabel = {
  draft: "rascunho",
  open: "aberta",
  paid: "paga",
  cancelled: "cancelada",
  refunded: "estornada",
  completed: "concluída",
};

export default async function VendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderByID(id);

  if (isApiError(order)) {
    return <p>{order.message}</p>;
  }

  return (
    <section className="mt-6 mb-4">
      <div className="no-print">
        <div className="mt-6 mb-4 flex items-center justify-between">
          <BackButton />

          <div className="flex items-center">
            <PrintOrderReceiptButton />

            <Link
              href={`/vendas/${order.id}/editar`}
              className="text-xs cursor-pointer mr-2"
            >
              editar
            </Link>
          </div>
        </div>

        <div className="flex justify-between">
          <h2 className="text-6xl">venda</h2>
          <div className="flex flex-col px-1 pt-1 items-center">
            <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-fit border">
              <p className="absolute top-5 text-sm font-normal">
                venda {order.order_number} {statusLabel[order.status]}
              </p>

              <p className="mt-10 sm:mt-12 text-4xl text-center">
                frigorífico saraiva
              </p>
              <p className="mt-2">{order.customer.name}</p>

              <div className="mt-5 w-fit h-fit border-b border-secondary/50">
                <p className="py-0.5 text-[12px]">
                  {formatDateTime(order.order_date)}
                </p>
              </div>

              <div className="relative w-full sm:w-100 h-5 mt-8 py-4 flex items-center justify-between">
                <p className="text-sm font-light">operador</p>
                <p className="text-sm font-light">{order.operator.name}</p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />

              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">subtotal</p>
                <p className="text-sm font-light">
                  {formatBRL(order.subtotal)}
                </p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />

              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">desconto</p>
                <p className="text-sm font-light">
                  {formatBRL(order.discount_amount ?? "0")}
                </p>
              </div>
              <hr className="border-t border-tertiary/25 w-full sm:w-100" />

              <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">total</p>
                <p className="text-sm font-light">
                  {formatBRL(order.total_amount)}
                </p>
              </div>

              <div className="relative mt-6 w-full sm:w-100 py-3 flex flex-col gap-2 border-t border-tertiary/25">
                <p className="text-xs uppercase">itens</p>
                {order.items.map((item) => (
                  <div key={item.id}>
                    <p className="text-sm">{item.product.name}</p>
                    <div
                      key={item.id}
                      className="flex-1 flex text-sm font-light w-full"
                    >
                      <p className="w-full text-left">
                        {item.quantity} {item.unit}
                      </p>

                      <p className="w-full text-left">
                        {formatBRL(item.price)}
                      </p>

                      <p className="w-full text-left">
                        {formatBRL(item.discount)}
                      </p>

                      <p className="w-full text-right">
                        {formatBRL(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative mt-2 w-full sm:w-100 py-3 flex flex-col gap-2 border-t border-tertiary/25">
                <p className="text-xs uppercase">pagamento</p>
                {order.payment_methods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between text-sm font-light uppercase"
                  >
                    <p>{method.method.description}</p>
                    <p>{formatBRL(method.amount)}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1 border-t border-tertiary/25">
                <p className="text-sm text-center font-light">
                  {order.notes ? `\"${order.notes.toLowerCase()}\"` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DeleteOrderButton id={order.id} />
      </div>

      <PrintOrderReceipt order={order} />
    </section>
  );
}
