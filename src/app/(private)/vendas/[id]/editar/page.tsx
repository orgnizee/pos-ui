import BackButton from "@/components/backButton";
import EditOrderForm from "@/components/editOrderForm";
import { getOrderByID } from "@/lib/api/orders";
import { isApiError } from "@/lib/api/types";

export default async function EditVendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderByID(id);
  if (isApiError(order)) {
    return <p>{order.message}</p>;
  }

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">editar venda</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditOrderForm id={id} order={order} />
      </div>
    </section>
  );
}
