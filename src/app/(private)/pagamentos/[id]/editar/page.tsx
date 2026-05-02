import BackButton from "@/components/backButton";
import { getAllContacts } from "@/lib/api/contacts";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { isApiError } from "@/lib/api/types";
import { getPayableByID } from "@/lib/api/payables";
import EditPayableForm from "@/components/editPayableForm";

export default async function EditPayablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [payment, contacts, categories] = await Promise.all([
    getPayableByID(id),
    getAllContacts(),
    getFinanceCategories(),
  ]);

  if (isApiError(payment)) return <p>{payment.message}</p>;
  if (isApiError(contacts)) return <p>{contacts.message}</p>;
  if (isApiError(categories)) return <p>{categories.message}</p>;

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 sm:text-6xl text-5xl text-start font-light">editar pagamento</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditPayableForm
          id={id}
          payment={payment}
          contacts={contacts}
          categories={categories}
        />
      </div>
    </section>
  );
}
