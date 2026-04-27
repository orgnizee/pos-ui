"use client";

import { Transaction } from "@/lib/api/transaction";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PrintTransactionReceipt({
  transaction,
}: {
  transaction: Transaction;
}) {
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.has("print");

  useEffect(() => {
    if (!shouldPrint) return;

    const t = setTimeout(() => {
      window.print();
    }, 300);

    return () => clearTimeout(t);
  }, [shouldPrint]);

  return (
    <div className="print-only receipt-thermal">
      <div className="w-[80mm] mx-auto text-[12px] font-mono">
        <p className="text-center text-lg font-bold">FRIGORÍFICO SARAIVA</p>

        <p className="text-center">{transaction.contact.name}</p>
        <p className="text-center">{formatDateTime(transaction.timestamp)}</p>

        <hr className="my-2 border-dashed" />

        <div className="flex justify-between">
          <span>op:</span>
          <span>{transaction.operator.name}</span>
        </div>

        <hr className="my-2 border-dashed" />

        <div className="flex justify-between">
          <span>tipo</span>
          <span>
            {transaction.type !== "transfer"
              ? transaction.category.name
              : "transferência"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>conta</span>
          <span>{transaction.account.name.toLowerCase()}</span>
        </div>

        <div className="flex justify-between">
          <span>valor</span>
          <span className={parseFloat(transaction.amount) < 0 ? "text-red-500" : ""}>
            {formatBRL(transaction.amount)}
          </span>
        </div>

        <hr className="my-2 border-dashed" />

        <div className="flex justify-between">
          <span>origem</span>
          <span>{transaction.payment || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span>venda</span>
          <span>
            {transaction.order.id
              ? `venda nº${transaction.order.order_number}`
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>ref</span>
          <span>{transaction.linked || "-"}</span>
        </div>

        <hr className="my-2 border-dashed" />

        <p className="text-center text-[10px] mt-2">{transaction.description}</p>
        <p className="text-center text-[10px] mt-2">movimento {transaction.id}</p>
      </div>
    </div>
  );
}
