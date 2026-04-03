import TransactionTable from "@/components/transactionsTable";
import { getAccounts, getTotalBalance } from "@/lib/api/bank-accounts";
import { getTransactions } from "@/lib/api/transaction";
import { isApiError } from "@/lib/api/types";
import { formatBRL } from "@/lib/utils/format";
import { ArrowRightLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";

export default async function Acompanhe() {
  const accounts = await getAccounts();
  const totalBalance = await getTotalBalance();
  const transactions = await getTransactions();

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  if (isApiError(totalBalance)) {
    return <p>{totalBalance.message}</p>;
  }

  if (isApiError(transactions)) {
    return <p>{transactions.message}</p>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mr-4 sm:mr-10">
        <h1 className="text-5xl sm:text-6xl normal-case">caixa</h1>

        {/* Transaction Buttons */}
        <div className="flex gap-2">
          <Link
            href={"caixa/entrada"}
            className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
          >
            <Plus className="text-white" size={16} />
          </Link>
          <Link
            href={"caixa/saida"}
            className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
          >
            <Minus className="text-white" size={16} />
          </Link>
          <Link
            href={"caixa/transferencia"}
            className="flex w-7 h-7 items-center justify-center rounded-md bg-black"
          >
            <ArrowRightLeft className="text-white" size={16} />
          </Link>
        </div>
      </div>

      {/* Bank Account Cards */}
      <div className="mt-8 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex px-1 pt-1 pb-5 gap-4 font-bold items-center">
            <div className="grid items-center justify-center shrink-0 rounded-md overflow-hidden">
              <p className="text-center text-sm normal-case font-light">
                saldo total
              </p>
              <p className="w-40 h-fit px-1 py-0.5 pt-1 rounded-md text-center text-sm normal-case bg-secondary/20">
                {formatBRL(totalBalance.total_balance)}
              </p>
            </div>

            {accounts.map((account) => (
              <div
                key={account.id}
                className="relative flex items-center justify-center min-w-77 min-h-45 sm:min-w-100 sm:min-h-55 shrink-0 rounded-full bg-secondary/10 overflow-hidden"
              >
                <p className="text-center text-2xl text-tertiary">
                  {formatBRL(account.balance)}
                </p>
                <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-2.5 py-1 text-sm normal-case font-light text-tertiary">
                  {account.name.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionTable transactions={transactions} />
    </section>
  );
}
