import { Suspense } from "react";
import BackButton from "@/components/backButton";
import DeleteProductButton from "@/components/deleteProductButton";
import { getProductByID } from "@/lib/api/products";
import { isApiError } from "@/lib/api/types";
import Link from "next/link";
import Loading from "./loading";

export async function ProductPayload({ id }: { id: string }) {
  const [product] = await Promise.all([
    getProductByID(id),
  ]);

  if (isApiError(product)) {
    return <p>{product.message}</p>;
  }

  const dash = (v?: string | null) => (v && v.trim() !== "" ? v : "-");

  return (
    <section className="mt-6 mb-4">
      <div className="mt-6 mb-4 flex items-center justify-between">
        <BackButton />

        <Link
          href={`/produtos/${product.id}/editar`}
          className="text-xs cursor-pointer mr-2"
        >
          editar
        </Link>
      </div>

      <div className="flex flex-col px-1 pt-1 items-center">
        <div className="relative mt-2 ml-auto mr-auto p-4 flex flex-col items-center justify-start w-140 h-fit border">
          <p className="absolute top-5 text-sm font-normal">produto</p>
          <p className="mt-10 sm:mt-12 text-4xl text-center">{product.name}</p>
          <p className="mt-2">{dash(product.brand)}</p>

          <div className="mt-5 w-fit h-fit border-b border-secondary/50">
            <p className="py-0.5 text-[12px]">{product.id}</p>
          </div>

          {[
            ["sku", dash(product.sku)],
            ["código de barras", dash(product.barcode)],
            ["unidade", dash(product.unit)],
            ["preço", dash(product.price)],
            ["custo", dash(product.cost)],
            ["estoque", String(product.stock)],
            ["origem", dash(product.origin)],
            ["ncm", dash(product.ncm)],
            ["cest", dash(product.cest)],
          ].map(([label, value]) => (
            <div key={label} className="w-full sm:w-100">
              <div className="relative h-5 py-4 flex items-center justify-between">
                <p className="text-sm font-light">{label}</p>
                <p className="text-sm font-light">{value}</p>
              </div>
              <hr className="border-t border-tertiary/25 w-full" />
            </div>
          ))}

          <div className="relative w-full sm:w-100 h-5 py-4 flex items-center justify-between">
            <p className="text-sm font-light">status</p>
            <p className="text-sm font-light">
              {product.is_active ? "ativo" : "inativo"} · {product.is_available ? "disponível" : "indisponível"}
            </p>
          </div>
        </div>
      </div>
      <DeleteProductButton id={product.id} />
    </section>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="mt-6">
      <Suspense fallback={<Loading />}>
        <ProductPayload id={id} />
      </Suspense>
    </section>
  );
}