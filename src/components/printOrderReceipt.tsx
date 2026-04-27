"use client";

import { Order } from "@/lib/api/orders";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrintOrderReceipt({ order }: { order: Order }) {
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.has("print");

  const router = useRouter();

  useEffect(() => {
    if (!shouldPrint) return;

    const handleAfterPrint = () => {
      router.back();
    };

    window.addEventListener("afterprint", handleAfterPrint);

    const t = setTimeout(() => {
      window.print();
    }, 300);

    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [shouldPrint, router]);

  return (
    <div className="print-only receipt-thermal">
      <div className="w-[80mm] mx-auto text-[12px] font-mono">
        <p className="text-center text-lg font-bold">FRIGORÍFICO SARAIVA</p>

        <p className="text-center">{order.customer.name}</p>
        <p className="text-center">{formatDateTime(order.order_date)}</p>

        <hr className="my-2 border-dashed" />

        <div className="flex justify-between">
          <span>op:</span>
          <span>{order.operator.name}</span>
        </div>

        <hr className="my-2 border-dashed" />

        {/* ITEMS */}
        {order.items.map((item) => (
          <div key={item.id} className="mb-1">
            <p>{item.product.name}</p>

            <div className="flex justify-between">
              <span>
                {item.quantity}x {formatBRL(item.price)}
              </span>
              <span>{formatBRL(item.total)}</span>
            </div>

            {item.discount !== "0" && (
              <div className="flex justify-between text-[10px]">
                <span>desc</span>
                <span>-{formatBRL(item.discount)}</span>
              </div>
            )}
          </div>
        ))}

        <hr className="my-2 border-dashed" />

        {/* TOTALS */}
        <div className="flex justify-between">
          <span>subtotal</span>
          <span>{formatBRL(order.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>desconto</span>
          <span>{formatBRL(order.discount_amount ?? "0")}</span>
        </div>

        <div className="flex justify-between font-bold">
          <span>total</span>
          <span>{formatBRL(order.total_amount)}</span>
        </div>

        <hr className="my-2 border-dashed" />

        {/* PAYMENTS */}
        {order.payment_methods.map((method) => (
          <div key={method.id} className="flex justify-between">
            <span>{method.method.description}</span>
            <span>{formatBRL(method.amount)}</span>
          </div>
        ))}

        <hr className="my-2 border-dashed" />

        <p className="text-center text-[10px] mt-2">{order.notes || ""}</p>

        <p className="text-center text-[10px] mt-2">
          venda {order.order_number}
        </p>
      </div>
    </div>
  );
}
