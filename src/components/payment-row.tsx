"use client";

import { Payment } from "@/lib/api/payments";
import { formatBRL } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

const statusDot: Record<Payment["status"], string> = {
  pending: "bg-yellow-500",
  paid: "bg-green-600",
  overdue: "bg-red-500",
  partially_paid: "bg-orange-400",
};

const statusLabel: Record<Payment["status"], string> = {
  pending: "pendente",
  paid: "pago",
  overdue: "em atraso",
  partially_paid: "parcialmente pago",
};

export default function PaymentRow({
  payment,
  basePath,
}: {
  payment: Payment;
  basePath: string;
}) {
  const router = useRouter();
  return (
    <tr
      className="h-15 bg-secondary/10 cursor-pointer hover:bg-secondary/20 transition-colors"
      onClick={() => router.push(`${basePath}/${payment.id}`)}
    >
      {/* Col 1: status dot (desktop) / stacked card (mobile) */}
      <td className="pl-3 rounded-md sm:w-auto" colSpan={1}>
        {/* Mobile: stacked layout */}
        <div className="flex flex-col gap-0.5 sm:hidden py-1">
          <span className="font-bold text-lg normal-case truncate leading-tight">
            {payment.contact.name}
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`block w-2 h-2 rounded-full shrink-0 ${statusDot[payment.status]}`}
            />
            <span className="font-bold">{formatBRL(payment.outstanding_balance)}</span>
            <span className="font-bold text-primary">
              {new Date(payment.due_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Desktop: status dot only */}
        <span
          className={`hidden sm:block w-2 h-2 rounded-full ${statusDot[payment.status]}`}
        />
      </td>

      {/* Col 2: amount (desktop only) */}
      <td className="hidden sm:table-cell px-2 text-start font-bold">
        {formatBRL(payment.outstanding_balance)}
      </td>

      {/* Col 3: name (desktop only) */}
      <td className="hidden sm:table-cell px-2 truncate font-bold text-start normal-case">
        {payment.contact.name}
      </td>

      {/* Col 4: due date (desktop only) */}
      <td className="hidden sm:table-cell px-2 text-start normal-case font-bold text-primary">
        {new Date(payment.due_at).toLocaleDateString("pt-BR")}
      </td>

      {/* Col 5: status label (desktop only) */}
      <td className="hidden sm:table-cell px-2 text-start font-bold normal-case text-primary">
        {statusLabel[payment.status]}
      </td>

      {/* Col 6: notes (desktop only) */}
      <td className="hidden sm:table-cell pr-4 text-right truncate normal-case font-light rounded-r-lg">
        {payment.notes}
      </td>
    </tr>
  );
}
