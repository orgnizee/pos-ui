"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Minus, Plus, X, Search } from "lucide-react";
import { Product } from "@/lib/api/products";
import { searchProductsAction } from "@/lib/api/actions/products";

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  initialProducts: Product[];
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatQty(qty: number, unit?: string | null) {
  if (unit && unit.toLowerCase() !== "un") {
    return `${qty.toLocaleString("pt-BR", { minimumFractionDigits: 3 })} ${unit}`;
  }
  return `${qty}`;
}

export default function PdvClient({ initialProducts }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Avoid stale closures in the global keydown handler
  const stateRef = useRef({
    showResults,
    results,
    highlightedIdx,
    addToCart: (_: Product) => {},
  });

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    const res = await searchProductsAction(query);
    setLoading(false);
    setResults(res);
    setShowResults(true);
    setHighlightedIdx(-1);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchProducts(val), 300);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSearch("");
    setResults([]);
    setShowResults(false);
    setHighlightedIdx(-1);
    searchRef.current?.focus();
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const totalItems = cart.length;
  const totalAmount = cart.reduce((s, i) => {
    const price = parseFloat(i.product.price ?? "0");
    return s + price * i.quantity;
  }, 0);

  // Keep stateRef current every render
  useEffect(() => {
    stateRef.current = { showResults, results, highlightedIdx, addToCart };
  });

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIdx >= 0 && listRef.current) {
      listRef.current.children[highlightedIdx]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIdx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { showResults, results, highlightedIdx, addToCart } =
        stateRef.current;

      if (showResults && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIdx((i) => Math.min(i + 1, results.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIdx((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter" && highlightedIdx >= 0) {
          e.preventDefault();
          addToCart(results[highlightedIdx]);
          return;
        }
      }

      if (
        e.key === "r" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        document.getElementById("btn-receber")?.click();
      }
      if (e.key === "Escape") {
        setShowResults(false);
        setHighlightedIdx(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="mt-4 grid grid-cols-[30%_70%] h-[calc(100vh-75px)]">
      {/* LEFT: Cart */}
      <div className="border relative h-full flex flex-col px-2 overflow-y-scroll scrollbar-hidden">
        <div className="sticky top-0 py-2 bg-white z-10">
          <p className="text-4xl text-secondary font-light">produtos</p>
        </div>

        <div className="mt-6 flex-1 flex flex-col gap-4">
          {cart.length === 0 && (
            <p className="text-tertiary text-sm text-center mt-8">
              nenhum produto adicionado
            </p>
          )}
          {cart.map((item, idx) => {
            const price = parseFloat(item.product.price ?? "0");
            const lineTotal = price * item.quantity;
            return (
              <div key={item.product.id} className="border p-1">
                <div className="text-lg flex justify-between border-b">
                  <p className="truncate pr-2">
                    {String(idx + 1).padStart(2, "0")}. {item.product.name}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <p>{formatBRL(price)}</p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-tertiary hover:text-black transition-colors"
                    >
                      <X size={14} strokeWidth={1} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-lg font-normal flex justify-center gap-2">
                  <p>{formatQty(item.quantity, item.product.unit)}</p>
                </div>

                <div className="text-lg font-normal flex justify-center gap-2">
                  <p>total</p>
                  <p>{formatBRL(lineTotal)}</p>
                </div>

                <div className="mt-7 text-lg flex justify-between gap-2">
                  <button
                    onClick={() => updateQty(item.product.id, -0.5)}
                    className="hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <Minus strokeWidth={0.8} />
                  </button>
                  <button
                    onClick={() => updateQty(item.product.id, 0.5)}
                    className="hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <Plus strokeWidth={0.8} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-auto bg-white pt-2 z-10">
          <p className="text-base font-light">totais</p>
          <div className="text-lg flex justify-between">
            <p>{String(totalItems).padStart(2, "0")}</p>
            <p>{formatBRL(totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Search */}
      <div className="flex-1 flex flex-col ml-6">
        <div className="justify-end flex">
          <p className="border w-fit p-2">consumidor final</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full relative">
            <div className="flex items-center gap-2 border-b border-tertiary">
              <Search
                size={16}
                strokeWidth={1}
                className="text-tertiary shrink-0"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="PESQUISAR PRODUTOS"
                className="w-full text-center bg-transparent outline-none uppercase text-base text-tertiary placeholder:text-tertiary py-1"
                autoComplete="off"
                autoFocus
              />
              {loading && (
                <span className="text-tertiary text-xs shrink-0 animate-pulse">
                  ...
                </span>
              )}
            </div>

            {showResults && results.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowResults(false)}
                />
                <ul
                  ref={listRef}
                  className="absolute left-0 right-0 top-full mt-1 border bg-white z-20 max-h-72 overflow-y-auto shadow-md"
                >
                  {results.map((p, idx) => (
                    <li key={p.id}>
                      <button
                        onClick={() => addToCart(p)}
                        className={`w-full text-left px-3 py-2 transition-colors flex justify-between items-center gap-4 ${
                          idx === highlightedIdx
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex flex-col">
                          <span className="text-sm uppercase">{p.name}</span>
                          {p.sku && (
                            <span className="text-xs text-tertiary">
                              SKU: {p.sku}
                            </span>
                          )}
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

        <div className="justify-end flex">
          <button
            id="btn-receber"
            disabled={cart.length === 0}
            className="border w-fit p-2 bg-black text-white cursor-pointer uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            receber [r]
          </button>
        </div>
      </div>
    </section>
  );
}
