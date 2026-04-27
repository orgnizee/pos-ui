"use client";

import { useActionState } from "react";
import { InputField } from "./inputField";
import { SelectInputField } from "./inputFieldSelect";
import {
  createProductAction,
  ProductActionState,
} from "@/lib/api/actions/products";
import { ProductCategory } from "@/lib/api/productCategories";

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-light text-tertiary uppercase tracking-widest mb-4">
      {label}
    </p>
  );
}

export default function ProductForm({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const [state, action, pending] = useActionState<ProductActionState, FormData>(
    createProductAction,
    null,
  );

  const error = state && "error" in state ? state.message : undefined;

  return (
    <form action={action} className="w-full max-w-4xl mt-12 mb-6">
      <div className="mb-8">
        <SectionLabel label="identificação" />
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <InputField label="nome" name="name" required autoFocus />
          <InputField label="marca" name="brand" />
          <InputField label="sku" name="sku" required />
          <InputField label="código de barras" name="barcode" />
          <InputField label="unidade" name="unit" />
          <SelectInputField
            label="categoria"
            name="category"
            defaultValue=""
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
          <InputField label="preço" name="price" />
          <InputField label="custo" name="cost" />
          <InputField label="estoque" name="stock" type="number" min={0} step="1" />
          <InputField label="origem" name="origin" />
          <InputField label="ncm" name="ncm" />
          <InputField label="cest" name="cest" />
        </div>
      </div>

      <div className="mb-8">
        <SectionLabel label="status" />
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input type="checkbox" name="track_stock" defaultChecked className="cursor-pointer" />
            controlar estoque
          </label>
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input type="checkbox" name="is_available" defaultChecked className="cursor-pointer" />
            disponível
          </label>
          <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked className="cursor-pointer" />
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
