import TransactionForm from "../../../../components/transaction-form";
import BackButton from "../../../../components/back-button";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bank-accounts";
import { getFinanceCategories } from "@/lib/api/finance-category";
import { getCustomers } from "@/lib/api/customers";

export default async function Acompanhe() {
  const accounts = await getAccounts();
  const categories = await getFinanceCategories();
  const customers = await getCustomers();

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  if (isApiError(categories)) {
    return <p>{categories.message}</p>;
  }

  if (isApiError(customers)) {
    return <p>{customers.message}</p>;
  }

  return (
    <section>
      <BackButton />
      <div className="flex flex-col mr-3 sm:mr-0 mt-10 sm:mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
          <p className="text-6xl text-start font-light normal-case">transferir</p>
        </div>
        <div className="mt-2 py-8 sm:py-0 relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-95 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <TransactionForm
            type="transfer"
            categories={categories}
            accounts={accounts.filter((a) => a.is_active)}
            contacts={customers}
          />
        </div>
      </div>
    </section>
  );
}
