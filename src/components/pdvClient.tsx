"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useActionState,
} from "react";
import { Minus, Plus, X, Search, ChevronDown } from "lucide-react";
import { Product } from "@/lib/api/products";
import { Customer } from "@/lib/api/customers";
import { PaymentMethod } from "@/lib/api/paymentMethods";
import { searchProductsAction } from "@/lib/api/actions/products";
import { searchCustomersAction } from "@/lib/api/actions/customer";
import {
  createOrderAction,
  CreateOrderActionState,
} from "@/lib/api/actions/orders";
import { formatCPF } from "@/lib/utils/format";
import { SelectInputField } from "./inputFieldSelect";
import { InputTextareaField } from "./inputTextAreaField";

type CartItem = {
  product: Product;
  quantity: number;
  discountCents: number;
};

type Props = {
  initialProducts: Product[];
  paymentMethods: PaymentMethod[];
};

type PaymentEntry = {
  method: string;
  amount: string;
  due_at: string;
};

const FALLBACK_DEFAULT_CUSTOMER = { id: null, name: "CONSUMIDOR FINAL" };

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseCurrencyToCents(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  return Number(digits || "0");
}

function formatQty(qty: number) {
  return qty.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

function parseQtyInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  return Number(digits || "0") / 1000;
}

function parseScaleBarcode(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("2") || digits.length !== 13) return null;

  const productCode = digits.slice(1, 6);
  const weightDigits = digits.slice(7, 12);
  const weightQty = Number(weightDigits) / 1000;

  if (!productCode || Number.isNaN(weightQty) || weightQty <= 0) return null;

  return {
    productCode,
    weightQty: Number(weightQty.toFixed(3)),
  };
}

export default function PdvClient({ initialProducts, paymentMethods }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [scaleBarcodeFeedback, setScaleBarcodeFeedback] = useState("");

  // Customer
  const [customer, setCustomer] = useState<{ id: string | null; name: string }>(
    FALLBACK_DEFAULT_CUSTOMER,
  );
  const [defaultCustomer, setDefaultCustomer] = useState<{
    id: string | null;
    name: string;
  }>(FALLBACK_DEFAULT_CUSTOMER);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [highlightedCustomerIdx, setHighlightedCustomerIdx] = useState(-1);
  const customerSearchRef = useRef<HTMLInputElement>(null);
  const customerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const customerListRef = useRef<HTMLUListElement>(null);

  const getDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const isFiadoMethod = useCallback(
    (methodId: string) => {
      const selectedMethod = paymentMethods.find(
        (method) => method.id === methodId,
      );
      return (
        selectedMethod?.description.toLowerCase().includes("fiado") ?? false
      );
    },
    [paymentMethods],
  );

  const searchRef = useRef<HTMLInputElement>(null);
  const receiveButtonRef = useRef<HTMLButtonElement>(null);
  const finalizeButtonRef = useRef<HTMLButtonElement>(null);
  const discountInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [discountCents, setDiscountCents] = useState(0);
  const [amountReceivedCents, setAmountReceivedCents] = useState(0);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [isPaymentAmountManuallyEdited, setIsPaymentAmountManuallyEdited] =
    useState(false);
  const [orderState, orderAction, pendingOrder] = useActionState<
    CreateOrderActionState,
    FormData
  >(createOrderAction, null);

  const stateRef = useRef<{
    showResults: boolean;
    results: Product[];
    highlightedIdx: number;
    addToCart: (product: Product) => void;
    showCustomerPicker: boolean;
    customerResults: Customer[];
    highlightedCustomerIdx: number;
    selectCustomer: (c: { id: string | null; name: string }) => void;
    defaultCustomer: { id: string | null; name: string };
  }>({
    showResults: false,
    results: [],
    highlightedIdx: -1,
    addToCart: () => {},
    showCustomerPicker: false,
    customerResults: [],
    highlightedCustomerIdx: -1,
    selectCustomer: () => {},
    defaultCustomer: FALLBACK_DEFAULT_CUSTOMER,
  });

  // Products search
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
    setScaleBarcodeFeedback("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchProducts(val), 300);
  };

  const addToCartWithQuantity = useCallback((product: Product, qty: number) => {
    const parsedQty = Number(qty.toFixed(3));
    if (parsedQty <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: Number((i.quantity + parsedQty).toFixed(3)),
              }
            : i,
        );
      }
      return [...prev, { product, quantity: parsedQty, discountCents: 0 }];
    });
    setSearch("");
    setResults([]);
    setShowResults(false);
    setHighlightedIdx(-1);
    setScaleBarcodeFeedback("");
    searchRef.current?.focus();
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      addToCartWithQuantity(product, 1);
    },
    [addToCartWithQuantity],
  );

  const handleScaleBarcodeSubmit = useCallback(async () => {
    const UNIT_CONVERSIONS: Record<string, (qty: number) => number> = {
      kg: (q) => q,
      g: (q) => q / 1000,
      un: (q) => q * 1000, // business rule: 1kg barcode = 1000 units
    };

    const parsed = parseScaleBarcode(search);
    if (!parsed) return false;

    const searchedProducts = await searchProductsAction(parsed.productCode);
    const exactMatch = searchedProducts.find(
      (product) =>
        product.barcode?.trim() === parsed.productCode ||
        product.sku?.trim() === parsed.productCode,
    );

    if (!exactMatch) {
      setScaleBarcodeFeedback("Etiqueta válida, mas produto não encontrado.");
      setShowResults(false);
      return true;
    }

    const unit = exactMatch.unit?.toLowerCase() ?? "kg";
    const convert = UNIT_CONVERSIONS[unit] ?? ((q: number) => q); // fallback = no conversion
    const finalQty = convert(parsed.weightQty);


    addToCartWithQuantity(exactMatch, finalQty);
    return true;
  }, [addToCartWithQuantity, search]);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id
            ? {
                ...i,
                quantity: Number((i.quantity + delta).toFixed(3)),
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const updateQtyFromInput = (id: string, rawValue: string) => {
    const parsedQty = Number(parseQtyInput(rawValue).toFixed(3));
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === id ? { ...i, quantity: parsedQty } : i,
      ),
    );
  };

  const updateItemDiscountFromInput = (id: string, rawValue: string) => {
    const nextDiscountCents = parseCurrencyToCents(rawValue);
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? {
              ...item,
              discountCents: Math.min(nextDiscountCents, 99999999),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  // Customer search
  const searchCustomers = useCallback(async (query: string) => {
    setCustomerLoading(true);
    const res = await searchCustomersAction(query);
    setCustomerLoading(false);
    setCustomerResults(res);
    setHighlightedCustomerIdx(-1);
  }, []);

  const handleCustomerSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    setCustomerSearch(val);
    if (customerDebounceRef.current) clearTimeout(customerDebounceRef.current);
    customerDebounceRef.current = setTimeout(() => searchCustomers(val), 300);
  };

  const selectCustomer = (c: { id: string | null; name: string }) => {
    setCustomer(c);
    setShowCustomerPicker(false);
    setHighlightedCustomerIdx(-1);
    setCustomerSearch("");
    setCustomerResults([]);
    searchRef.current?.focus();
  };

  const openCustomerPicker = useCallback(() => {
    setShowCustomerPicker(true);
    setHighlightedCustomerIdx(-1);
    searchCustomers("");
    setTimeout(() => customerSearchRef.current?.focus(), 50);
  }, [searchCustomers]);

  useEffect(() => {
    let isMounted = true;

    const loadDefaultCustomer = async () => {
      const customers = await searchCustomersAction("");
      if (!isMounted) return;

      const consumidorFinal = customers.find(
        (c) => c.name.trim().toLowerCase() === "consumidor final",
      );
      if (!consumidorFinal) return;

      const nextDefaultCustomer = {
        id: consumidorFinal.id,
        name: consumidorFinal.name,
      };
      setDefaultCustomer(nextDefaultCustomer);
      setCustomer(nextDefaultCustomer);
    };

    loadDefaultCustomer();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalItems = cart.length;
  const totalAmount = Number(
    cart
      .reduce((s, i) => {
        const price = parseFloat(i.product.price ?? "0");
        return s + price * i.quantity;
      }, 0)
      .toFixed(2),
  );
  const itemDiscountTotal = Number(
    (
      cart.reduce((sum, item) => {
        const price = parseFloat(item.product.price ?? "0");
        const maxDiscount = Math.round(price * item.quantity * 100);
        return sum + Math.min(item.discountCents, maxDiscount);
      }, 0) / 100
    ).toFixed(2),
  );
  const discount = discountCents / 100;
  const orderTotal = Math.max(totalAmount - itemDiscountTotal - discount, 0);
  const paymentTotal = payments.reduce((sum, payment) => {
    return sum + (Number(payment.amount) || 0);
  }, 0);
  const remaining = orderTotal - paymentTotal;
  const change = Math.max(amountReceivedCents / 100 - orderTotal, 0);
  const canSubmitOrder =
    cart.length > 0 && payments.length > 0 && Math.abs(remaining) < 0.001;

  const resetCheckout = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const dinheiroMethod = paymentMethods.find((method) =>
      method.description.toLowerCase().includes("dinheiro"),
    );
    const defaultMethodId = dinheiroMethod?.id ?? paymentMethods[0]?.id ?? "";
    setPayments(
      paymentMethods.length > 0
        ? [
            {
              method: defaultMethodId,
              amount: orderTotal.toFixed(2),
              due_at: isFiadoMethod(defaultMethodId) ? getDueDate() : today,
            },
          ]
        : [],
    );
    setDiscountCents(0);
    setAmountReceivedCents(0);
    setIsPaymentAmountManuallyEdited(false);
  }, [isFiadoMethod, orderTotal, paymentMethods]);

  const openCheckoutDrawer = useCallback(() => {
    resetCheckout();
    setShowCheckoutDrawer(true);
  }, [resetCheckout]);

  useEffect(() => {
    if (!showCheckoutDrawer) return;

    const timer = setTimeout(() => {
      discountInputRef.current?.focus();
      discountInputRef.current?.select();
    }, 0);

    return () => clearTimeout(timer);
  }, [showCheckoutDrawer]);

  // Keep stateRef current every render
  useEffect(() => {
    stateRef.current = {
      showResults,
      results,
      highlightedIdx,
      addToCart,
      showCustomerPicker,
      customerResults,
      highlightedCustomerIdx,
      selectCustomer,
      defaultCustomer,
    };
  });

  // Scroll highlighted product into view
  useEffect(() => {
    if (highlightedIdx >= 0 && listRef.current) {
      listRef.current.children[highlightedIdx]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIdx]);

  // Scroll highlighted customer into view
  useEffect(() => {
    if (highlightedCustomerIdx >= 0 && customerListRef.current) {
      customerListRef.current.children[highlightedCustomerIdx]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedCustomerIdx]);

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      const {
        showResults,
        results,
        highlightedIdx,
        addToCart,
        showCustomerPicker,
        customerResults,
        highlightedCustomerIdx,
        selectCustomer,
        defaultCustomer,
      } = stateRef.current;

      // Customer picker navigation (+1 for "consumidor final" at index 0)
      const customerListLength = customerResults.length + 1;
      if (showCustomerPicker) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedCustomerIdx((i) =>
            Math.min(i + 1, customerListLength - 1),
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedCustomerIdx((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (highlightedCustomerIdx === 0) {
            selectCustomer(defaultCustomer);
          } else if (highlightedCustomerIdx > 0) {
            const c = customerResults[highlightedCustomerIdx - 1];
            if (c) {
              selectCustomer({ id: c.id, name: c.name });
            }
          } else if (customerResults.length > 0) {
            const firstCustomer = customerResults[0];
            selectCustomer({ id: firstCustomer.id, name: firstCustomer.name });
          }
          return;
        }
      }

      if (e.key === "Enter" && document.activeElement === searchRef.current) {
        const handledScaleBarcode = await handleScaleBarcodeSubmit();
        if (handledScaleBarcode) {
          e.preventDefault();
          return;
        }
      }

      // Product results navigation
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
        if (e.key === "Enter") {
          e.preventDefault();
          const productToAdd =
            highlightedIdx >= 0 ? results[highlightedIdx] : results[0];
          if (productToAdd) {
            addToCart(productToAdd);
          }
          return;
        }
      }

      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        receiveButtonRef.current?.click();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (showCustomerPicker) {
          customerSearchRef.current?.focus();
        } else {
          openCustomerPicker();
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === "m" && showCheckoutDrawer) {
        e.preventDefault();
        document.getElementById("payment-method-0")?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "f" && showCheckoutDrawer) {
        e.preventDefault();
        finalizeButtonRef.current?.focus();
        if (!finalizeButtonRef.current?.disabled) {
          finalizeButtonRef.current?.click();
        }
      }
      if (e.key === "Escape") {
        setShowResults(false);
        setShowCustomerPicker(false);
        setHighlightedIdx(-1);
        setHighlightedCustomerIdx(-1);
        setShowCheckoutDrawer(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    handleScaleBarcodeSubmit,
    openCustomerPicker,
    showCheckoutDrawer,
    showCustomerPicker,
  ]);

  const today = new Date().toISOString().split("T")[0];
  const discountAmount = formatBRL(discountCents / 100);
  const amountReceived = formatBRL(amountReceivedCents / 100);

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
            const grossLineTotal = price * item.quantity;
            const lineDiscount = Math.min(item.discountCents / 100, grossLineTotal);
            const lineTotal = Math.max(grossLineTotal - lineDiscount, 0);
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

                <div className="mt-8 text-lg font-normal flex justify-center items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatQty(item.quantity)}
                    onChange={(e) =>
                      updateQtyFromInput(item.product.id, e.target.value)
                    }
                    className="w-20 bg-transparent border-b border-tertiary/30 text-center outline-none focus:border-tertiary"
                    aria-label={`quantidade de ${item.product.name}`}
                  />
                  {item.product.unit && (
                    <span className="text-sm text-tertiary uppercase">
                      {item.product.unit}
                    </span>
                  )}
                </div>

                <div className="text-lg font-normal flex justify-center gap-2">
                  <p>total</p>
                  <p>{formatBRL(lineTotal)}</p>
                </div>

                <div className="mt-1 text-sm flex items-center justify-center gap-2">
                  <label
                    htmlFor={`item-discount-${item.product.id}`}
                    className="text-tertiary"
                  >
                    desconto
                  </label>
                  <input
                    id={`item-discount-${item.product.id}`}
                    type="text"
                    inputMode="numeric"
                    value={formatBRL(item.discountCents / 100)}
                    onChange={(e) =>
                      updateItemDiscountFromInput(item.product.id, e.target.value)
                    }
                    className="w-15 bg-transparent text-tertiary text-center outline-none"
                    aria-label={`desconto de ${item.product.name}`}
                  />
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
          <div className="text-sm flex justify-between text-tertiary">
            <p>desconto itens</p>
            <p>- {formatBRL(itemDiscountTotal)}</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col ml-6">
        {/* Customer picker */}
        <div className="justify-end flex relative">
          <button
            onClick={() =>
              showCustomerPicker
                ? setShowCustomerPicker(false)
                : openCustomerPicker()
            }
            className="border w-fit p-2 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className={customer.id ? "" : "text-tertiary"}>
              {customer.name.toUpperCase()}
            </span>
            <ChevronDown size={14} strokeWidth={1} />
          </button>

          {showCustomerPicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCustomerPicker(false)}
              />
              <div className="absolute top-full right-0 mt-1 border bg-white z-20 w-72 shadow-md">
                <div className="flex items-center gap-2 border-b px-2">
                  <Search
                    size={14}
                    strokeWidth={1}
                    className="text-tertiary shrink-0"
                  />
                  <input
                    ref={customerSearchRef}
                    type="text"
                    value={customerSearch}
                    onChange={handleCustomerSearchChange}
                    placeholder="BUSCAR CLIENTE"
                    className="w-full py-2 bg-transparent outline-none text-sm placeholder:text-tertiary"
                    autoComplete="off"
                  />
                  {customerLoading && (
                    <span className="text-tertiary text-xs shrink-0 animate-pulse">
                      ...
                    </span>
                  )}
                </div>
                <ul ref={customerListRef} className="max-h-60 overflow-y-auto">
                  {customerResults.map((c, idx) => (
                    <li key={c.id}>
                      <button
                        onClick={() =>
                          selectCustomer({ id: c.id, name: c.name })
                        }
                        className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                          highlightedCustomerIdx === idx + 1
                            ? "bg-gray-100"
                            : ""
                        } ${customer.id === c.id ? "font-medium" : ""}`}
                      >
                        <span className="block uppercase">{c.name}</span>
                        {c.cpf && (
                          <span className="text-xs text-tertiary">
                            {formatCPF(c.cpf)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                  {!customerLoading &&
                    customerResults.length === 0 &&
                    customerSearch.trim() && (
                      <li className="px-3 py-2 text-sm text-tertiary">
                        nenhum cliente encontrado
                      </li>
                    )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Product search */}
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
                className="w-full text-center bg-transparent outline-none text-base text-tertiary placeholder:text-tertiary py-1"
                autoComplete="off"
                autoFocus
              />
              {loading && (
                <span className="text-tertiary text-xs shrink-0 animate-pulse">
                  ...
                </span>
              )}
            </div>
            {scaleBarcodeFeedback && (
              <p className="mt-2 text-xs text-red-500">
                {scaleBarcodeFeedback}
              </p>
            )}

            {showResults && results.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowResults(false)}
                />
                <ul
                  ref={listRef}
                  className="absolute left-0 right-0 top-full mt-1 border bg-white z-20 max-h-62 overflow-y-auto shadow-md scrollbar-hidden"
                >
                  {results.map((p, idx) => (
                    <li key={p.id}>
                      <button
                        onClick={() => addToCart(p)}
                        className={`w-full text-left px-3 py-2 transition-colors flex justify-between items-center gap-4 ${
                          idx === highlightedIdx
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
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
            ref={receiveButtonRef}
            disabled={cart.length === 0}
            onClick={openCheckoutDrawer}
            className="border w-fit p-2 bg-black text-white cursor-pointer uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            receber [ctrl + enter]
          </button>
        </div>
      </div>

      {showCheckoutDrawer && (
        <>
          <div
            className="fixed inset-0 bg-white/90 z-40"
            onClick={() => setShowCheckoutDrawer(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-xl bg-white border-l z-50 p-6 overflow-y-auto">
            <h2 className="text-4xl uppercase">
              Total {formatBRL(totalAmount)}
            </h2>

            <form action={orderAction} className="mt-4 flex flex-col gap-1">
              <div className="flex justify-between">
                <p className="">desconto</p>

                <input
                  ref={discountInputRef}
                  value={discountAmount}
                  onChange={(e) => {
                    const nextDiscountCents = parseCurrencyToCents(
                      e.target.value,
                    );
                    setDiscountCents(nextDiscountCents);

                    if (!isPaymentAmountManuallyEdited) {
                      const nextOrderTotal = Math.max(
                        totalAmount - nextDiscountCents / 100,
                        0,
                      );
                      setPayments((prev) =>
                        prev.map((payment, idx) =>
                          idx === 0
                            ? { ...payment, amount: nextOrderTotal.toFixed(2) }
                            : payment,
                        ),
                      );
                    }
                  }}
                  className="text-primary placeholder:text-secondary outline-none text-end"
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                />
              </div>
              <input
                type="hidden"
                name="discount_amount"
                value={(discountCents / 100).toFixed(2)}
              />

              <div className="flex justify-between">
                <span>valor recebido</span>
                <input
                  value={amountReceived}
                  onChange={(e) =>
                    setAmountReceivedCents(parseCurrencyToCents(e.target.value))
                  }
                  className="text-primary placeholder:text-secondary outline-none text-end"
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                />
              </div>

              <div className="flex justify-between">
                <span>troco</span>
                <span>{formatBRL(change)}</span>
              </div>

              <input type="hidden" name="customer" value={customer.id ?? ""} />
              <input
                type="hidden"
                name="items"
                value={JSON.stringify(
                  cart.map((item) => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price ?? "0",
                    discount: (
                      Math.min(
                        item.discountCents,
                        Math.round(
                          parseFloat(item.product.price ?? "0") *
                            item.quantity *
                            100,
                        ),
                      ) / 100
                    ).toFixed(2),
                  })),
                )}
              />
              <input
                type="hidden"
                name="payment_methods"
                value={JSON.stringify(payments)}
              />
              <input type="hidden" name="order_date" value={today} />
              <input type="hidden" name="status" value="completed" />

              <p className="mt-8 uppercase text-tertiary">
                formas de pagamento
              </p>
              <div className="border p-3 space-y-3">
                {/* <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setPayments((prev) => [
                        ...prev,
                        {
                          method: paymentMethods[0]?.id ?? "",
                          amount: "",
                          due_at: today,
                        },
                      ])
                    }
                    className="cursor-pointer"
                  >
                    <Plus strokeWidth={0.8} />
                  </button>
                </div> */}

                {payments.map((payment, idx) => (
                  <div
                    key={`${payment.method}-${idx}`}
                    className="grid grid-cols-12 gap-2"
                  >
                    <div className="col-span-6">
                      <SelectInputField
                        id={`payment-method-${idx}`}
                        label="pagamento"
                        value={payment.method}
                        onChange={(e) => {
                          const selectedMethodId = e.target.value;
                          setPayments((prev) =>
                            prev.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    method: selectedMethodId,
                                    due_at: isFiadoMethod(selectedMethodId)
                                      ? getDueDate()
                                      : today,
                                  }
                                : p,
                            ),
                          );
                        }}
                        options={paymentMethods.map((m) => ({
                          label: m.description.toUpperCase(),
                          value: m.id,
                        }))}
                      />
                    </div>

                    <div className="col-span-6">
                      <input
                        value={formatBRL(Number(payment.amount) || 0)}
                        onChange={(e) => {
                          setIsPaymentAmountManuallyEdited(true);
                          setPayments((prev) =>
                            prev.map((p, i) =>
                              i === idx
                                ? {
                                    ...p,
                                    amount: (
                                      parseCurrencyToCents(e.target.value) / 100
                                    ).toFixed(2),
                                  }
                                : p,
                            ),
                          );
                        }}
                        className="text-primary placeholder:text-secondary outline-none text-end w-full mt-6"
                        placeholder="R$ 0,00"
                        inputMode="numeric"
                      />
                    </div>

                    {isFiadoMethod(payment.method) && (
                      <div className="col-span-12">
                        <label
                          htmlFor={`payment-due-at-${idx}`}
                          className="text-xs text-tertiary"
                        >
                          vencimento
                        </label>
                        <input
                          id={`payment-due-at-${idx}`}
                          type="date"
                          value={payment.due_at || getDueDate()}
                          onChange={(e) =>
                            setPayments((prev) =>
                              prev.map((p, i) =>
                                i === idx
                                  ? { ...p, due_at: e.target.value }
                                  : p,
                              ),
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* <button
                      type="button"
                      onClick={() =>
                        setPayments((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="col-span-1 flex items-end justify-end"
                    >
                      <X size={14} strokeWidth={1} />
                    </button> */}
                  </div>
                ))}

                {Math.abs(remaining) >= 0.001 && (
                  <p className="text-xs text-red-500">
                    a soma dos pagamentos deve ser igual ao total do pedido.
                  </p>
                )}
              </div>

              <InputTextareaField label="observações" name="notes" />

              <div className="absolute bottom-25 right-5">
                <p className="text-4xl">a pagar {formatBRL(orderTotal)}</p>
              </div>

              {orderState?.error && (
                <p className="text-sm text-red-500">{orderState.message}</p>
              )}

              <div className="absolute bottom-5 w-132">
                <button
                  id="btn-finalizar"
                  ref={finalizeButtonRef}
                  disabled={!canSubmitOrder || pendingOrder}
                  className="border w-full p-2 uppercase disabled:opacity-40"
                >
                  {pendingOrder ? "salvando..." : "finalizar [ctrl + f]"}
                </button>
              </div>
            </form>
          </aside>
        </>
      )}
    </section>
  );
}
