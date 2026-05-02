import { Suspense } from "react";
import TransactionForm from "@/components/transactionForm";
import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getContacts } from "@/lib/api/contacts";
import Loading from "./loading";

export async function AddTransferPayload() {
  const accounts = await getAccounts();
  const categories = await getFinanceCategories();
  const customers = await getContacts();

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
      <p className="mt-8 sm:text-6xl text-5xl text-start font-light">transferir</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <TransactionForm
          type="transfer"
          categories={categories}
          accounts={accounts.filter((a) => a.is_active)}
          contacts={customers}
        />
      </div>
    </section>
  );
}

export default async function AddTransferPage() {
  return (
    <section className="mt-6">
      <div className="no-print">
        <Suspense fallback={<Loading />}>
          <AddTransferPayload />
        </Suspense>
      </div>
    </section>
  );
}