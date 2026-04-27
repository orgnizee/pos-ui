"use client";

import { useActionState } from "react";
import { InputField } from "./inputField";
import { SelectInputField } from "./inputFieldSelect";
import {
  ProductActionState,
  updateProductAction,
} from "@/lib/api/actions/products";
import { Product } from "@/lib/api/products";
import { ProductCategory } from "@/lib/api/productCategories";

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

export default function EditProductForm({
  id,
  product,
  categories,
}: {
  id: string;
  product: Product;
  categories: ProductCategory[];
}) {
  const actionBound = updateProductAction.bind(null, id);
  const [state, action, pending] = useActionState<ProductActionState, FormData>(
    actionBound,
    null,
  );

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      <div className="mb-8">
        <SectionLabel label="identificação" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <InputField label="nome" name="name" required defaultValue={product.name} autoFocus />
          <InputField label="marca" name="brand" defaultValue={product.brand ?? ""} />
          <InputField label="sku" name="sku" defaultValue={product.sku ?? ""} />
          <InputField label="código de barras" name="barcode" defaultValue={product.barcode ?? ""} />
          <InputField label="unidade" name="unit" defaultValue={product.unit ?? ""} />
          <SelectInputField
            label="categoria"
            name="category"
            defaultValue={product.category ?? ""}
            options={categories.map((category) => ({
              label: category.name.toUpperCase(),
              value: category.id,
            }))}
          />
        </div>
      </div>

      <div className="mb-8">
        <SectionLabel label="valores e estoque" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <InputField label="preço" name="price" defaultValue={product.price ?? ""} />
          <InputField label="custo" name="cost" defaultValue={product.cost ?? ""} />
          <InputField
            label="estoque"
            name="stock"
            type="number"
            min={0}
            step="1"
            defaultValue={String(product.stock ?? 0)}
          />
          <InputField label="origem" name="origin" defaultValue={product.origin ?? ""} />
          <InputField label="ncm" name="ncm" defaultValue={product.ncm ?? ""} />
          <InputField label="cest" name="cest" defaultValue={product.cest ?? ""} />
        </div>
      </div>

      <div className="mb-8">
        <SectionLabel label="status" />
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input
              type="checkbox"
              name="track_stock"
              defaultChecked={product.track_stock}
              className="cursor-pointer"
            />
            controlar estoque
          </label>
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={product.is_available}
              className="cursor-pointer"
            />
            disponível
          </label>
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product.is_active}
              className="cursor-pointer"
            />
            ativo
          </label>
        </div>
      </div>

      <div className="mt-10 w-full">
        {error && (
          <p className="mb-2 text-xs font-light normal-case text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-5 py-1.5 text-sm border uppercase disabled:opacity-50 cursor-pointer"
        >
          salvar
        </button>
      </div>
    </form>
  );
}
