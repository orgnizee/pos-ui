import BackButton from "@/components/backButton";
import { isApiError } from "@/lib/api/types";
import { getAccounts } from "@/lib/api/bankAccounts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getCustomers } from "@/lib/api/customers";
import ReceivableForm from "@/components/receivableForm";

export default async function AddReceberPage() {
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
      <p className="mt-8 text-6xl text-start font-light">novo recebimento</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <ReceivableForm
          contacts={customers}
          categories={categories}
          defaultType="receivable"
        />
      </div>
    </section>
  );
}
