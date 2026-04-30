import BackButton from "@/components/backButton";
import { getCustomerByID, Customer } from "@/lib/api/customers";
import { getSupplierByID, Supplier } from "@/lib/api/suppliers";
import { Contact } from "@/lib/api/contacts";
import { isApiError } from "@/lib/api/types";
import EditContactForm from "@/components/editContactForm";

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
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">editar contato</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditContactForm id={id} contact={contact} />
      </div>
    </section>
  );
}
