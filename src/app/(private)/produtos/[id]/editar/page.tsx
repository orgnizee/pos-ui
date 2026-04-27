import BackButton from "@/components/backButton";
import EditProductForm from "@/components/editProductForm";
import { getProductByID } from "@/lib/api/products";
import { getProductCategories } from "@/lib/api/productCategories";
import { isApiError } from "@/lib/api/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductByID(id);
  const categories = await getProductCategories();

  if (isApiError(product)) return <p>{product.message}</p>;
  if (isApiError(categories)) return <p>{categories.message}</p>;

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">editar produto</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <EditProductForm id={id} product={product} categories={categories} />
      </div>
    </section>
  );
}
