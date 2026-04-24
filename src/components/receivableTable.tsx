"use client";

import { Receivable, PaymentStatus } from "@/lib/api/receivables";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

interface ReceivableTableProps {
  receivables: Receivable[];
  basePath: string;
}

const statusDot: Record<PaymentStatus, string> = {
  pending: "bg-primary",
  paid: "bg-green-500",
  overdue: "bg-red-500",
  partially_paid: "bg-orange-400",
};

export default function ReceivableTable({
  receivables,
  basePath,
}: ReceivableTableProps) {
  const grouped = groupByIssuedDate(
    [...receivables].sort(
      (a, b) => new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime(),
    ),
  );
  
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
                <col className="w-22" />
                <col className="hidden sm:table-column w-32" />
                <col className="hidden sm:table-column w-28" />
                <col className="hidden sm:table-column w-52" />
              </colgroup>
              <tbody>
                {group.map((receivable) => (
                  <tr
                    key={receivable.id}
                    className="h-15 cursor-pointer"
                    onClick={() => router.push(`${basePath}/${receivable.id}`)}
                  >
                    <td className="border-b border-secondary/50">
                      <div
                        className={`w-2 h-2 ${statusDot[receivable.status]}`}
                      />
                    </td>
                    <td className="px-2 text-start border-b border-secondary/50">
                      {formatBRL(receivable.total_amount)}
                    </td>
                    <td className="hidden sm:table-cell px-2 text-start border-b border-secondary/50">
                      {receivable.contact.name ?? "-"}
                    </td>
                    <td className="px-2 pr-4 text-end sm:text-start border-b border-secondary/50">
                      {formatBRL(receivable.outstanding_balance)}
                    </td>
                    <td className="hidden sm:table-cell px-2 pr-4 text-start border-b border-secondary/50">
                      {receivable.category?.name ?? "-"}
                    </td>
                    <td className="hidden sm:table-cell px-2 pr-4 text-start border-b border-secondary/50">
                      {formatDateTime(receivable.due_at)}
                    </td>
                    <td className="hidden sm:table-cell pr-4 text-right border-b border-secondary/50">
                      {receivable.notes}
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

const groupByDueDate = (receivables: Receivable[]) => {
  const groups: Record<string, Receivable[]> = {};

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  for (const receivable of receivables) {
    const [year, month, day] = receivable.due_at
      .split("T")[0]
      .split("-")
      .map(Number);
    const date = new Date(year, month - 1, day); // local time, no UTC shift

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
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(receivable);
  }

  return groups;
};

const groupByIssuedDate = (receivables: Receivable[]) => {
  const groups: Record<string, Receivable[]> = {};

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  for (const receivable of receivables) {
    const [year, month, day] = receivable.issued_at
      .split("T")[0]
      .split("-")
      .map(Number);
    const date = new Date(year, month - 1, day); // local time, no UTC shift

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
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(receivable);
  }

  return groups;
};