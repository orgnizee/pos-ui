import BackButton from "@/components/backButton";
import EditPaymentForm from "@/components/edit-payment-form";
import { getPaymentByID } from "@/lib/api/payments";
import { getCustomers } from "@/lib/api/customers";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { isApiError } from "@/lib/api/types";

export default async function EditPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [payment, contacts, categories] = await Promise.all([
    getPaymentByID(id),
    getCustomers(),
    getFinanceCategories(),
  ]);

  if (isApiError(payment)) return <p>{payment.message}</p>;
  if (isApiError(contacts)) return <p>{contacts.message}</p>;
  if (isApiError(categories)) return <p>{categories.message}</p>;

  return (
    <section>
      <BackButton />
      <div className="flex flex-col sm:mr-0 mt-10 sm:mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
          <p className="text-6xl text-start font-light normal-case">
            editar recebimento
          </p>
        </div>
        <div className="mt-2 mb-8 py-8 sm:py-0 relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-95 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <EditPaymentForm
            id={id}
            payment={payment}
            contacts={contacts}
            categories={categories}
          />
        </div>
      </div>
    </section>
  );
}
