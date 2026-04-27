import { Product } from "@/lib/api/products";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative p-2 px-2 w-full min-h-37.5 border">
      <div className="flex items-center justify-between h-7.5 w-full mb-1.5">
        <kbd className="text-sm text-start font-light text-primary truncate">
          {product.brand || "/"}
        </kbd>
        <div className="text-nowrap text-xs text-primary truncate">
          <p>{product.sku || product.id}</p>
        </div>
      </div>

      <Link
        href={`/produtos/${product.id}`}
        className="flex flex-col justify-between items-start border w-full h-32.5"
      >
        <div className="px-3 py-2 w-full h-full">
          <p className="w-full text-start text-lg text-primary truncate">{product.name}</p>

          <div className="w-full text-start text-primary/50">
            <span className="block truncate">preço: {product.price || "-"}</span>
          </div>

          <div className="w-full text-start text-primary/50">
            <span className="block truncate">estoque: {product.stock}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
