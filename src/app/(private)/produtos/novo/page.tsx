import BackButton from "@/components/backButton";
import ProductForm from "@/components/productForm";
import { getProductCategories } from "@/lib/api/productCategories";
import { isApiError } from "@/lib/api/types";

export default async function NewProductPage() {
  const categories = await getProductCategories();

  if (isApiError(categories)) {
    return <p>{categories.message}</p>;
  }

  return (
    <section className="mt-6">
      <BackButton />
      <p className="mt-8 text-6xl text-start font-light">novo produto</p>

      <div className="relative flex items-center justify-center mt-2 ml-auto mr-auto w-full">
        <ProductForm categories={categories} />
      </div>
    </section>
  );
}
