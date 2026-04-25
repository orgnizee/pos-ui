"use client";

import { Search } from "lucide-react";
import { Product } from "@/lib/api/products";
import { formatBRL } from "./utils";

type Props = {
  searchRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
  search: string;
  loading: boolean;
  results: Product[];
  showResults: boolean;
  highlightedIdx: number;
  scaleBarcodeFeedback: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusSearch: () => void;
  onCloseResults: () => void;
  onAddToCart: (product: Product) => void;
};

export function ProductSearch({
  searchRef,
  listRef,
  search,
  loading,
  results,
  showResults,
  highlightedIdx,
  scaleBarcodeFeedback,
  onSearchChange,
  onFocusSearch,
  onCloseResults,
  onAddToCart,
}: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full relative">
        <div className="flex items-center gap-2 border-b border-tertiary">
          <Search size={16} strokeWidth={1} className="text-tertiary shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={onSearchChange}
            onFocus={onFocusSearch}
            placeholder="PESQUISAR PRODUTOS"
            className="w-full text-center bg-transparent outline-none text-base text-tertiary placeholder:text-tertiary py-1"
            autoComplete="off"
            autoFocus
          />
          {loading && <span className="text-tertiary text-xs shrink-0 animate-pulse">...</span>}
        </div>

        {scaleBarcodeFeedback && <p className="mt-2 text-xs text-red-500">{scaleBarcodeFeedback}</p>}

        {showResults && results.length > 0 && (
          <>
            <div className="fixed inset-0 z-10" onClick={onCloseResults} />
            <ul
              ref={listRef}
              className="absolute left-0 right-0 top-full mt-1 border bg-white z-20 max-h-62 overflow-y-auto shadow-md scrollbar-hidden"
            >
              {results.map((p, idx) => (
                <li key={p.id}>
                  <button
                    onClick={() => onAddToCart(p)}
                    className={`w-full text-left px-3 py-2 transition-colors flex justify-between items-center gap-4 ${
                      idx === highlightedIdx ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className="text-sm uppercase">{p.name}</span>
                      {p.sku && <span className="text-xs text-tertiary">SKU: {p.sku}</span>}
                    </span>
                    <span className="text-sm shrink-0 font-medium">
                      {p.price ? formatBRL(parseFloat(p.price)) : "—"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
