import BackButton from "@/components/back-button";
import { getCustomerByID, Customer } from "@/lib/api/customers";
import { getSupplierByID, Supplier } from "@/lib/api/suppliers";
import { Contact } from "@/lib/api/contacts";
import { isApiError } from "@/lib/api/types";
import EditContactForm from "@/components/edit-contact-form";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await getCustomerByID(id);
  const isCustomer = !isApiError(customer);

  let contact: Contact;

  if (isCustomer) {
    contact = { kind: "customer", ...(customer as Customer) };
  } else {
    const supplier = await getSupplierByID(id);
    if (isApiError(supplier)) return <p>{supplier.message}</p>;
    contact = { kind: "supplier", ...(supplier as Supplier) };
  }

  return (
    <section>
      <BackButton />
      <div className="flex flex-col sm:mr-0 mt-10 sm:mt-8 px-1 pt-1 items-center font-bold">
        <div className="relative ml-auto mr-auto flex items-start justify-start w-full sm:w-150">
          <p className="text-6xl text-start font-light normal-case">
            editar contato
          </p>
        </div>
        <div className="mt-2 mb-8 py-8 sm:py-0 relative ml-auto mr-auto flex items-center justify-center w-full min-h-65 sm:w-150 sm:min-h-95 shrink-0 rounded-4xl bg-secondary/10 overflow-hidden">
          <EditContactForm id={id} contact={contact} />
        </div>
      </div>
    </section>
  );
}
