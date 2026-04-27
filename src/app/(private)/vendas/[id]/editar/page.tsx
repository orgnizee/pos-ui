import BackButton from "@/components/backButton";
import EditOrderForm from "@/components/editOrderForm";
import { getOrderByID } from "@/lib/api/orders";
import { getPaymentMethods } from "@/lib/api/paymentMethods";
import { getProducts } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";

export default async function EditVendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [order, products, paymentMethods] = await Promise.all([
    getOrderByID(id),
    getProducts({ is_active: true }),
    getPaymentMethods(),
  ]);

  if (isApiError(order)) {
    return <p>{order.message}</p>;
  }

  if (isApiError(products)) {
    return <p>{products.message}</p>;
  }

  if (isApiError(paymentMethods)) {
    return <p>{paymentMethods.message}</p>;
  }

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">editar venda</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditOrderForm
          id={id}
          order={order}
          products={products}
          paymentMethods={paymentMethods}
        />
      </div>
    </section>
  );
}
