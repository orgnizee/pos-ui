import { Transaction } from "@/lib/api/transaction";
import { formatBRL } from "@/lib/utils/format";
import { ArrowDown } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const grouped = groupByDate(transactions);

  return (
    <section className="sm:mr-10 mr-4">
      <p className="mt-8 font-bold text-lg">histórico</p>
      {Object.entries(grouped).map(([label, group]) => (
        <div key={label}>
          <p className="mt-10">{label}</p>
          <div className="mt-2 w-full overflow-hidden">
            <table className="w-full table-fixed border-separate border-spacing-y-2">
              <colgroup>
                <col className="w-20 sm:w-10" />
                <col className="w-32" />
                <col className="hidden sm:table-column w-32" />
                <col className="w-32" />
                <col className="hidden sm:table-column w-48" />
              </colgroup>
              <tbody>
                {group.map((transaction) => (
                  <tr key={transaction.id} className="h-15 bg-secondary/10">
                    <td className="pl-3 rounded-l-lg">
                      <ArrowDown strokeWidth={1.2} className="text-green-600" />
                    </td>
                    <td className="px-2 text-start font-bold">
                      {formatBRL(transaction.amount)}
                    </td>
                    <td className="hidden sm:table-cell px-2 truncate text-start normal-case">
                      {transaction.contact.name ?? "-"}
                    </td>
                    <td className="px-2 pr-4 text-end sm:text-center normal-case rounded-r-lg">
                      {transaction.account.name.toLowerCase()}
                    </td>
                    <td className="hidden sm:table-cell pr-4 text-right truncate normal-case rounded-r-lg">
                      {transaction.description.toLowerCase()}
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
