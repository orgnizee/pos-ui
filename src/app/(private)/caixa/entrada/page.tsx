import { getAccounts, getTotalBalance } from "@/lib/api/bank-accounts";
import { isApiError } from "@/lib/api/types";
import TransactionForm from "./form";
import BackButton from "./back-button";

export default async function Acompanhe() {
  const accounts = await getAccounts();
  const totalBalance = await getTotalBalance();

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  if (isApiError(totalBalance)) {
    return <p>{totalBalance.message}</p>;
  }

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mt-10 sm:m-12 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
          <p className="text-6xl text-start font-light normal-case">entrada</p>
        </div>
        <div className="mt-2 relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-95 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <TransactionForm type="credit" accounts={accounts} />
        </div>
      </div>
    </section>
  );
}
