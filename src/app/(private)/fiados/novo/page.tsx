import { Suspense } from "react";
import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getAllContacts } from "@/lib/api/contacts";
import ReceivableForm from "@/components/receivableForm";
import Loading from "./loading";

export async function AddReceberPayload() {
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
      <p className="mt-8 sm:text-6xl text-5xl text-start font-light">novo fiado</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <ReceivableForm
          contacts={contacts}
          categories={categories}
          defaultType="receivable"
        />
      </div>
    </section>
  );
}

export default async function AddReceberPage() {
  return (
    <section className="mt-6">
      <div className="no-print">
        <Suspense fallback={<Loading />}>
          <AddReceberPayload />
        </Suspense>
      </div>
    </section>
  );
}
