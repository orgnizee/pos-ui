import BackButton from "@/components/back-button";
import DeleteTransactionButton from "@/components/delete-transaction-button";
import { getTransactionByID } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";
import { formatBRL, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transaction = await getTransactionByID(id);

  if (isApiError(transaction)) {
    return <p>{transaction.message}</p>;
  }

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mr-3 sm:mr-0 px-1 pt-1 items-center font-bold">
        <div className="relative mt-2 py-8 sm:py-0 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-full h-125 sm:w-140 sm:h-120 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <p className="absolute top-5 text-sm font-light">
            {formatDateTime(transaction.timestamp)}
          </p>

          <p
            className={`mt-10 sm:mt-15 text-4xl ${parseFloat(transaction.amount) < 0 ? "text-red-500" : ""}`}
          >
            {formatBRL(transaction.amount)}
          </p>

          <p className="normal-case">{transaction.contact.name}</p>

          <div className="mt-5 w-fit h-fit rounded-full bg-tertiary/10">
            <p className="px-2 py-0.5 text-xs font-light normal-case">
              {transaction.type !== "transfer" && transaction.category.name}
              {transaction.type === "transfer" && "transferência"}
            </p>
          </div>

          <div className="relative w-full sm:w-100 h-5 mt-8 px-2 py-4 flex items-center justify-between rounded-t-md bg-tertiary/10">
            <p className="text-sm font-light normal-case">operador</p>
            <p className="text-sm font-light normal-case">
              {transaction.operator.name}
            </p>
          </div>

          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">conta</p>
            <p className="text-sm font-light normal-case">
              {transaction.account.name.toLowerCase()}
            </p>
          </div>

          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between bg-tertiary/10">
            <p className="text-sm font-light normal-case">origem</p>
            <p className="text-sm font-light normal-case">
              {transaction.payment ?? "-"}
            </p>
          </div>

          <hr className="border-t border-tertiary/25 w-full sm:w-100" />

          <div className="relative w-full sm:w-100 h-5 px-2 py-4 flex items-center justify-between rounded-b-md bg-tertiary/10">
            <p className="text-sm font-light normal-case">ref</p>
            {transaction.linked && (
              <Link
                href={`/caixa/historico/${transaction.linked}`}
                className="text-sm font-light normal-case"
              >
                {transaction.linked}
              </Link>
            )}
            {!transaction.linked && (
              <p className="text-sm font-light normal-case">-</p>
            )}
          </div>

          <div className="relative mt-4 w-full sm:w-100 px-2 py-3 flex flex-col gap-1 rounded-md bg-tertiary/10">
            <p className="text-sm text-center font-light normal-case">
              {transaction.description.toLowerCase()}
            </p>
          </div>

          <p className="absolute bottom-4 text-sm font-light text-tertiary">
            {transaction.id}
          </p>
        </div>

        <DeleteTransactionButton id={transaction.id} />
      </div>
    </section>
  );
}
