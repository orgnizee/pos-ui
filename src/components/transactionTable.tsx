"use client";

import { Transaction } from "@/lib/api/transaction";
import { formatBRL } from "@/lib/utils/format";
import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  DollarSign,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const grouped = groupByDate(transactions);
  const router = useRouter();

  return (
    <section className="mt-12">
      {Object.entries(grouped).map(([label, group]) => (
        <div key={label}>
          <p>{label}</p>

          <div className="mt-2 w-full overflow-hidden">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-10 sm:w-10" />
                <col className="w-32 sm:w-22" />
                <col className="hidden sm:table-column w-42" />
                <col className="hidden sm:table-column w-32" />
                <col className="w-22" />
                <col className="hidden sm:table-column w-48" />
              </colgroup>

              <tbody>
                {group.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="h-15 cursor-pointer "
                    onClick={() =>
                      router.push(`/caixa/historico/${transaction.id}`)
                    }
                  >
                    <td className="border-b border-secondary/50">
                      {transaction.type === "credit" && (
                        <div className="w-2 h-2 bg-green-500"></div>
                      )}
                      {transaction.type === "debit" && (
                        <div className="w-2 h-2 bg-red-500"></div>
                      )}
                      {transaction.type === "transfer" && (
                        <div className="w-2 h-2 bg-primary"></div>
                      )}
                    </td>
                    <td className="px-2 text-start border-b border-secondary/50">
                      {formatBRL(transaction.amount)}
                    </td>
                    <td className="hidden sm:table-cell px-2 text-start border-b border-secondary/50">
                      {transaction.contact.name ?? "-"}
                    </td>
                    <td className="px-2 pr-4 text-end sm:text-start border-b border-secondary/50">
                      {transaction.account.name}
                    </td>
                    <td className="hidden sm:table-cell px-2 pr-4 text-end sm:text-start border-b border-secondary/50">
                      {transaction.category?.name ?? "-"}
                    </td>
                    <td className="hidden sm:table-cell pr-4 text-right border-b border-secondary/50">
                      {transaction.description}
                    </td>
                  </tr>
                ))}
                <tr className="h-10"></tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}

const groupByDate = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};

  for (const transaction of transactions) {
    const date = new Date(transaction.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    let label: string;
    if (isSameDay(date, today)) {
      label = "hoje";
    } else if (isSameDay(date, yesterday)) {
      label = "ontem";
    } else {
      label = date
        .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        .replace(".", "")
        .replace(/^\w/, (c) => c.toUpperCase());
      // "01 abr" → "01 Abr"
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(transaction);
  }

  return groups;
};
