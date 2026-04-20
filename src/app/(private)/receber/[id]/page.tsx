import BackButton from "@/components/back-button";
import DeletePaymentButton from "@/components/delete-payment-button";
import { getPaymentByID, PaymentStatus } from "@/lib/api/payments";
import { isApiError } from "@/lib/api/types";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPaymentByID(id);

  if (isApiError(payment)) {
    return <p>{payment.message}</p>;
  }

  const statusLabel: Record<PaymentStatus, string> = {
    pending: "pendente",
    paid: "pago",
    overdue: "vencido",
    partially_paid: "parcialmente pago",
  };

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mr-3 sm:mr-0 px-1 pt-1 items-center font-bold">
        <div className="relative mt-2 py-8 sm:py-0 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-full h-125 sm:w-140 sm:h-125 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <p className="absolute top-5 text-sm font-light">
            {formatDateTime(payment.due_at)}
          </p>

          <Link
            href={`/receber/${id}/editar`}
            className="absolute top-4.5 right-5 text-sm font-light normal-case text-primary/75 bg-secondary/20 rounded-full px-1.5 pt-0.5"
          >
            editar
          </Link>

          <p
            className={`mt-10 sm:mt-15 text-4xl ${
              parseFloat(payment.total_amount) < 0 ? "text-red-500" : ""
            }`}
          >
            {formatBRL(payment.total_amount)}
          </p>

          <p className="normal-case">{payment.contact?.name}</p>

          <div className="mt-5 w-fit h-fit rounded-full bg-tertiary/10">
            <p className="px-2 py-0.5 text-xs font-light normal-case">
              {payment.category?.name?.toLowerCase() ?? "sem categoria"}
            </p>
          </div>

          <div className="relative w-full sm:w-100 mt-8 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">status</p>
            <p className="text-sm font-light normal-case">
              {statusLabel[payment.status]}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">pago em</p>
            <p className="text-sm font-light normal-case">
              {payment.paid_at ? formatDateTime(payment.paid_at) : "-"}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">valor pago</p>
            <p className="text-sm font-light normal-case">
              {formatBRL(payment.amount_paid)}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">saldo devedor</p>
            <p className="text-sm font-light normal-case">
              {formatBRL(payment.outstanding_balance)}
            </p>
          </div>
          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">forma de pagamento</p>
            <p className="text-sm font-light normal-case">
              {payment.payment_method?.toLowerCase() ?? "-"}
            </p>
          </div>

          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between rounded-b-md bg-tertiary/10">
            <p className="text-sm font-light normal-case">ref</p>
            {payment.reference ? (
              <p className="text-sm font-light normal-case">
                {payment.reference}
              </p>
            ) : (
              <p className="text-sm font-light normal-case">-</p>
            )}
          </div>

          {payment.notes && (
            <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1 rounded-md bg-tertiary/10">
              <p className="text-sm text-center font-light normal-case">
                {payment.notes.toLowerCase()}
              </p>
            </div>
          )}

          <p className="absolute bottom-4 text-sm font-light text-tertiary">
            {payment.id}
          </p>
        </div>

        <DeletePaymentButton id={payment.id} />
      </div>
    </section>
  );
}
