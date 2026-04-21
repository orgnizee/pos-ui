import TransactionForm from "@/components/transactionForm";
import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bank-accounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getCustomers } from "@/lib/api/customers";

export default async function AddDebitPage() {
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
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">saída</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <TransactionForm
          type="debit"
          categories={categories}
          accounts={accounts.filter((a) => a.is_active)}
          contacts={customers}
        />
      </div>
    </section>
  );
}
