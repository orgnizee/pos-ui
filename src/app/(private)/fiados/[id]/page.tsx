import BackButton from "@/components/backButton";
import DeletePaymentButton from "@/components/deleteReceivableButton";
import { getReceivableByID, PaymentStatus } from "@/lib/api/receivables";
import { getAccounts } from "@/lib/api/bankAccounts";
import { isApiError } from "@/lib/api/types";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import SettleButton from "@/components/settleReceivableutton";
import Link from "next/link";

export default async function FiadosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [payment, accounts] = await Promise.all([
    getReceivableByID(id),
    getAccounts(),
  ]);

  if (isApiError(payment)) return <p>{payment.message}</p>;
  if (isApiError(accounts)) return <p>{accounts.message}</p>;

  const statusLabel: Record<PaymentStatus, string> = {
    pending: "pendente",
    paid: "pago",
    overdue: "vencido",
    partially_paid: "parcialmente pago",
  };

  const canSettle = ["pending", "overdue", "partially_paid"].includes(
    payment.status,
  );
  const canEdit = ["pending", "overdue"].includes(payment.status);

  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <BackButton />

        {canSettle && <SettleButton receivable={payment} accounts={accounts} />}
      </div>

      <div className="flex flex-col px-1 pt-1 items-center">
        <div
          className={`relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-130 border ${payment.status === "overdue" ? "border-red-500" : payment.status === "paid" ? "border-green-500" : ""}`}
        >
          <p className="absolute top-5 text-sm font-normal">
            {formatDateTime(payment.due_at)}
          </p>

          <p
            className={`mt-10 sm:mt-15 text-5xl ${
              parseFloat(payment.total_amount) < 0 ? "text-red-500" : ""
            }`}
          >
            {formatBRL(payment.total_amount)}
          </p>

          <p className="mt-2">{payment.contact?.name}</p>

          <div className="mt-5 w-fit h-fit border-b border-secondary/50">
            <p className="py-0.5 text-[12px]">
              {payment.category?.name ?? "sem categoria"}
            </p>
          </div>

          <div className="relative w-full sm:w-100 h-5 mt-8 py-4 flex items-center justify-between">
            <p className="text-sm font-light">status</p>
            <p className="text-sm font-light">{statusLabel[payment.status]}</p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">pago em</p>
            <p className="text-sm font-light">
              {payment.paid_at ? formatDateTime(payment.paid_at) : "-"}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">valor pago</p>
            <p className="text-sm font-light">
              {formatBRL(payment.amount_paid)}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">saldo devedor</p>
            <p className="text-sm font-light">
              {formatBRL(payment.outstanding_balance)}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">forma de pagamento</p>
            <p className="text-sm font-light">
              {payment.payment_method?.toLowerCase() ?? "-"}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">ref</p>
            <p className="text-sm font-light">{payment.reference ?? "-"}</p>
          </div>

          {payment.notes && (
            <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1">
              <p className="text-sm text-center font-light">
                {payment.notes.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {canEdit && <DeletePaymentButton id={payment.id} />}

        {canEdit && (
          <Link
            href={`/fiados/${payment.id}/editar`}
            className="mt-3 ml-1 flex justify-start items-center cursor-pointer uppercase text-xs"
          >
            editar
          </Link>
        )}
      </div>
    </section>
  );
}
