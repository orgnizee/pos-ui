import BackButton from "@/components/backButton";
import { getReceivableByID } from "@/lib/api/receivables";
import { getAllContacts } from "@/lib/api/contacts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { isApiError } from "@/lib/api/types";
import EditReceivableForm from "@/components/editReceivableForm";

export default async function EditPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [payment, contacts, categories] = await Promise.all([
    getReceivableByID(id),
    getAllContacts(),
    getFinanceCategories(),
  ]);

  if (isApiError(payment)) return <p>{payment.message}</p>;
  if (isApiError(contacts)) return <p>{contacts.message}</p>;
  if (isApiError(categories)) return <p>{categories.message}</p>;

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">editar recebimento</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditReceivableForm
          id={id}
          payment={payment}
          contacts={contacts}
          categories={categories}
        />
      </div>
    </section>
  );
}
