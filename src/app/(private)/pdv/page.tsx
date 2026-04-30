import PdvClient from "@/components/pdvClient";
import { getFinanceCategories } from "@/lib/api/financeCategory";
import { getPaymentMethods } from "@/lib/api/paymentMethods";
import { getProducts } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";

export default async function PdvPage() {
  const [initialProducts, paymentMethods, categories] = await Promise.all([
    getProducts({ is_active: true }),
    getPaymentMethods(),
    getFinanceCategories(),
  ]);

  if (isApiError(categories)) {
    return
  }

  const vendas = categories.find(
    (c) => c.name.trim().toLowerCase() === "vendas",
  );

  return (
    <PdvClient
      initialProducts={isApiError(initialProducts) ? [] : initialProducts}
      paymentMethods={isApiError(paymentMethods) ? [] : paymentMethods}
      standardCategory={isApiError(categories) ? "" : vendas?.id ?? ""}
    />
  );
}
