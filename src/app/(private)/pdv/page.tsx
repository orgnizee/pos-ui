import PdvClient from "@/components/pdvClient";
import { getPaymentMethods } from "@/lib/api/paymentMethods";
import { getProducts } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";

export default async function PdvPage() {
  const [initialProducts, paymentMethods] = await Promise.all([
    getProducts({ is_active: true }),
    getPaymentMethods(),
  ]);

  return (
    <PdvClient
      initialProducts={isApiError(initialProducts) ? [] : initialProducts}
      paymentMethods={isApiError(paymentMethods) ? [] : paymentMethods}
    />
  );
}
