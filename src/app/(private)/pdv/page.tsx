import PdvClient from "@/components/pdvClient";
import { getProducts } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";

export default async function PdvPage() {
  const initial = await getProducts({ is_active: true });
  return <PdvClient initialProducts={isApiError(initial) ? [] : initial} />;
}
