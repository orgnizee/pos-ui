import { Suspense } from "react";
import TransactionForm from "@/components/transactionForm";
import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getAllContacts } from "@/lib/api/contacts";
import Loading from "./loading";

export async function AddCreditPayload() {
  const accounts = await getAccounts();
  const categories = await getFinanceCategories();
  const contacts = await getAllContacts();

  if (isApiError(accounts)) {
    return <p>{accounts.message}</p>;
  }

  if (isApiError(categories)) {
    return <p>{categories.message}</p>;
  }

  if (isApiError(contacts)) {
    return <p>{contacts.message}</p>;
  }

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">entrada</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <TransactionForm
          type="credit"
          categories={categories}
          accounts={accounts.filter((a) => a.is_active)}
          contacts={contacts}
        />
      </div>
    </section>
  );
}

export default async function AddCreditPage() {
  return (
    <section className="mt-6">
      <div className="no-print">
        <Suspense fallback={<Loading />}>
          <AddCreditPayload />
        </Suspense>
      </div>
    </section>
  );
}