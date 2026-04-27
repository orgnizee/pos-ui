import { isApiError } from "@/lib/api/types";
import buildFilterHref from "@/lib/utils/search-params";
import Link from "next/link";
import { filterClass } from "@/lib/styleFilterButtons";
import SearchInput from "@/components/searchInput";
import { Plus } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import ProductCard from "@/components/productCard";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const { search, status } = resolvedParams;

  const isAll = !status;
  const isAvailable = status === "available";
  const isUnavailable = status === "unavailable";

  const allProducts = await getProducts({
    search: typeof search === "string" && search.length >= 3 ? search : undefined,
    is_active: true,
  });

  if (isApiError(allProducts)) {
    return <p>{allProducts.message}</p>;
  }

  const products = allProducts.filter((product) => {
    if (isAvailable) return product.is_available;
    if (isUnavailable) return !product.is_available;
    return true;
  });

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-8xl font-light">produtos</h1>

        <Link
          href={"produtos/novo"}
          className="flex w-10 h-10 items-center justify-center border border-primary hover:border-tertiary"
        >
          <Plus className="text-primary" size={16} />
        </Link>
      </div>

      <div className="flex justify-end mt-8">
        <SearchInput endpoint="produtos" />
      </div>

      <div className="mt-2 ml-1 overflow-hidden">
        <div className="overflow-auto flex">
          <div className="overflow-x-auto scrollbar-hidden flex pt-1 pb-5 gap-2 font-bold items-center">
            <Link
              href={"/produtos"}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isAll)}>todos</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { status: "available" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isAvailable)}>disponíveis</p>
            </Link>
            <Link
              href={buildFilterHref(resolvedParams, { status: "unavailable" })}
              className="grid items-center justify-center shrink-0 rounded-md"
            >
              <p className={filterClass(isUnavailable)}>indisponíveis</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid mt-0 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1">
        {products
          .filter((product) => product.is_active)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
