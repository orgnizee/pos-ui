import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getAllContacts } from "@/lib/api/contacts";
import PayableForm from "@/components/payableForm";

export default async function AddReceberPage() {
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
      <p className="mt-8 text-6xl text-start font-light">novo pagamento</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <PayableForm
          contacts={contacts}
          categories={categories}
          defaultType="payable"
        />
      </div>
    </section>
  );
}
