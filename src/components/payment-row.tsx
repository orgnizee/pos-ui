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
      <td className="pl-3 rounded-l-lg">
        <span
          className={`block w-2 h-2 rounded-full ${statusDot[payment.status]}`}
        />
      </td>
      <td className="px-2 text-start font-bold">
        {formatBRL(payment.outstanding_balance)}
      </td>
      <td className="hidden sm:table-cell px-2 truncate font-bold text-start normal-case">
        {payment.contact.name}
      </td>
      <td className="px-2 text-start normal-case font-bold text-primary">
        {new Date(payment.due_at).toLocaleDateString("pt-BR")}
      </td>
      <td
        className={`hidden sm:table-cell px-2 text-start font-bold normal-case rounded-r-lg text-primary`}
      >
        {statusLabel[payment.status]}
      </td>
      <td className="hidden sm:table-cell pr-4 text-right truncate normal-case font-light rounded-r-lg">
        {payment.notes}
      </td>
    </tr>
  );
}
