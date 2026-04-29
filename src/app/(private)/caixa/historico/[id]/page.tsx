import { Suspense } from "react";
import BackButton from "@/components/backButton";
import DeleteTransactionButton from "@/components/deleteTransactionButton";
import PrintOrderReceiptButton from "@/components/printOrderReceiptButton";
import PrintTransactionReceipt from "@/components/printTransactionReceipt";
import { getTransactionByID } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";
import Loading from "./loading";

async function TransactionPayload({ id }: { id: string }) {
  const transaction = await getTransactionByID(id);

  if (isApiError(transaction)) {
    return <p>{transaction.message}</p>;
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-6xl">comprovante pagamento</h2>
        <div className="flex flex-col px-1 pt-1 items-center">
          <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-120 border">
            <p className="absolute top-5 text-sm font-normal">
              {formatDateTime(transaction.timestamp)}
            </p>

            <p
              className={`mt-10 sm:mt-15 text-5xl ${parseFloat(transaction.amount) < 0 ? "text-red-500" : ""}`}
            >
              {formatBRL(transaction.amount)}
            </p>

            <p className="mt-2">{transaction.contact.name}</p>

            <div className="mt-5 w-fit h-fit border-b border-secondary/50">
              <p className="py-0.5 text-[12px]">
                {transaction.type !== "transfer" && transaction.category.name}
                {transaction.type === "transfer" && "transferência"}
              </p>
            </div>

            <div className="relative w-full sm:w-100 h-5 mt-8 py-4 flex items-center justify-between">
              <p className="text-sm font-light">operador</p>
              <p className="text-sm font-light">{transaction.operator.name}</p>
            </div>

            <hr className="border-t border-tertiary/25 w-full sm:w-100" />

            <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
              <p className="text-sm font-light">conta</p>
              <p className="text-sm font-light">
                {transaction.account.name.toLowerCase()}
              </p>
            </div>

            <hr className="border-t border-tertiary/25 w-full sm:w-100" />

            <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
              <p className="text-sm font-light">origem</p>
              <p className="text-sm font-light">
                {transaction.payment && (
                  <Link href={`/fiados/${transaction.payment}`}>
                    {transaction.payment}
                  </Link>
                )}
                {!transaction.payment && "-"}
              </p>
            </div>

            <hr className="border-t border-tertiary/25 w-full sm:w-100" />

            <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
              <p className="text-sm font-light">ref</p>
              {transaction.linked && (
                <Link
                  href={`/caixa/historico/${transaction.linked}`}
                  className="text-sm font-light"
                >
                  {transaction.linked}
                </Link>
              )}
              {!transaction.linked && <p className="text-sm font-light">-</p>}
            </div>

            <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1">
              <p className="text-sm text-center font-light">
                {`"${transaction.description.toLowerCase()}"`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DeleteTransactionButton id={transaction.id} />

      <PrintTransactionReceipt transaction={transaction} />
    </>
  );
}

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="mt-6">
      <div className="no-print">
        <div className="mt-6 mb-4 flex items-center justify-between">
          <BackButton />

          <div className="flex items-center">
            <PrintOrderReceiptButton />
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <TransactionPayload id={id} />
        </Suspense>
      </div>
    </section>
  );
}
