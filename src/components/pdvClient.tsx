"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useActionState,
} from "react";
import { searchProductsAction } from "@/lib/api/actions/products";
import { searchCustomersAction } from "@/lib/api/actions/customer";
import { createOrderAction, OrderActionState } from "@/lib/api/actions/orders";
import { Product } from "@/lib/api/products";
import { Customer } from "@/lib/api/customers";
import { PaymentMethod } from "@/lib/api/paymentMethods";
import { CustomerPicker } from "./pdv/CustomerPicker";
import { ProductSearch } from "./pdv/ProductSearch";
import { CartPanel } from "./pdv/CartPanel";
import { CheckoutDrawer } from "./pdv/CheckoutDrawer";
import { BarcodeScannerButton } from "./pdv/BarcodeScannerButton";
import { CartItem, CustomerOption, PaymentEntry } from "./pdv/types";
import {
  FALLBACK_DEFAULT_CUSTOMER,
  automaticCentDiscountCents,
  formatBRL,
  getDueDate,
  getTodayDate,
  lineTotalCents,
  parseCurrencyToCents,
  parseQtyInput,
  parseScaleBarcode,
} from "./pdv/utils";

type Props = {
  initialProducts: Product[];
  paymentMethods: PaymentMethod[];
  standardCategory: string;
};

export default function PdvClient({
  initialProducts,
  paymentMethods,
  standardCategory,
}: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const nextCartItemIdRef = useRef(0);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [scaleBarcodeFeedback, setScaleBarcodeFeedback] = useState("");

  const [customer, setCustomer] = useState<CustomerOption>(
    FALLBACK_DEFAULT_CUSTOMER,
  );
  const [defaultCustomer, setDefaultCustomer] = useState<CustomerOption>(
    FALLBACK_DEFAULT_CUSTOMER,
  );
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
  const searchRef = useRef<HTMLInputElement>(null);
  const receiveButtonRef = useRef<HTMLButtonElement>(null);
  const finalizeButtonRef = useRef<HTMLButtonElement>(null);
  const amountPaidInputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [discountCents, setDiscountCents] = useState(0);
  const [amountReceivedCents, setAmountReceivedCents] = useState(0);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [isPaymentAmountManuallyEdited, setIsPaymentAmountManuallyEdited] =
    useState(false);
  const [orderState, orderAction, pendingOrder] = useActionState<
    OrderActionState,
    FormData
  >(createOrderAction, null);

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

  const stateRef = useRef<{
    showResults: boolean;
    results: Product[];
    highlightedIdx: number;
    addToCart: (product: Product) => void;
    showCustomerPicker: boolean;
    customerResults: Customer[];
    highlightedCustomerIdx: number;
    selectCustomer: (c: CustomerOption) => void;
    defaultCustomer: CustomerOption;
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
      return [
        ...prev,
        {
          id: `${product.id}-${nextCartItemIdRef.current++}`,
          product,
          quantity: parsedQty,
          discountCents: automaticCentDiscountCents(product.price, parsedQty),
        },
      ];
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

  const handleBarcodeValue = useCallback(
    async (rawCode: string, showNotFoundFeedback = false) => {
      const code = rawCode.trim();
      if (!code) return false;

      const exactMatches = await searchProductsAction(code);
      const exactMatch = exactMatches.find(
        (product) =>
          product.barcode?.trim() === code || product.sku?.trim() === code,
      );

      if (exactMatch) {
        addToCart(exactMatch);
        return true;
      }

      const UNIT_CONVERSIONS: Record<string, (qty: number) => number> = {
        kg: (q) => q,
        g: (q) => q / 1000,
        un: (q) => q * 1000,
      };

      const parsed = parseScaleBarcode(code);
      if (!parsed) {
        if (showNotFoundFeedback) {
          setScaleBarcodeFeedback("Código lido, mas produto não encontrado.");
        }
        return false;
      }

      const searchedProducts = await searchProductsAction(parsed.productCode);
      const scaleMatch = searchedProducts.find(
        (product) =>
          product.barcode?.trim() === parsed.productCode ||
          product.sku?.trim() === parsed.productCode,
      );

      if (!scaleMatch) {
        setScaleBarcodeFeedback("Etiqueta válida, mas produto não encontrado.");
        setShowResults(false);
        return true;
      }

      const unit = scaleMatch.unit?.toLowerCase() ?? "kg";
      const convert = UNIT_CONVERSIONS[unit] ?? ((q: number) => q);
      const finalQty = convert(parsed.weightQty);

      addToCartWithQuantity(scaleMatch, finalQty);
      return true;
    },
    [addToCart, addToCartWithQuantity],
  );

  const handleScaleBarcodeSubmit = useCallback(async () => {
    return handleBarcodeValue(search);
  }, [handleBarcodeValue, search]);

  const updateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id !== itemId) return i;

          const previousLineTotalCents = lineTotalCents(
            i.product.price,
            i.quantity,
          );
          const previousAutomaticDiscountCents = automaticCentDiscountCents(
            i.product.price,
            i.quantity,
          );
          const nextQuantity = Number((i.quantity + delta).toFixed(3));
          const nextLineTotalCents = lineTotalCents(
            i.product.price,
            nextQuantity,
          );
          const nextAutomaticDiscountCents = automaticCentDiscountCents(
            i.product.price,
            nextQuantity,
          );

          return {
            ...i,
            quantity: nextQuantity,
            discountCents:
              i.discountCents === previousAutomaticDiscountCents ||
              i.discountCents > previousLineTotalCents
                ? nextAutomaticDiscountCents
                : Math.min(i.discountCents, nextLineTotalCents),
          };
        })
        .filter((i) => i.quantity > 0),
    );
  };

  const updateQtyFromInput = (itemId: string, rawValue: string) => {
    const parsedQty = Number(parseQtyInput(rawValue).toFixed(3));
    setCart((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;

        const previousLineTotalCents = lineTotalCents(
          i.product.price,
          i.quantity,
        );
        const previousAutomaticDiscountCents = automaticCentDiscountCents(
          i.product.price,
          i.quantity,
        );
        const nextLineTotalCents = lineTotalCents(i.product.price, parsedQty);
        const nextAutomaticDiscountCents = automaticCentDiscountCents(
          i.product.price,
          parsedQty,
        );

        return {
          ...i,
          quantity: parsedQty,
          discountCents:
            i.discountCents === previousAutomaticDiscountCents ||
            i.discountCents > previousLineTotalCents
              ? nextAutomaticDiscountCents
              : Math.min(i.discountCents, nextLineTotalCents),
        };
      }),
    );
  };

  const updateItemDiscountFromInput = (itemId: string, rawValue: string) => {
    const nextDiscountCents = parseCurrencyToCents(rawValue);
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              discountCents: Math.min(nextDiscountCents, 99999999),
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

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

  const selectCustomer = (c: CustomerOption) => {
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
  const totalAmountCents = cart.reduce(
    (sum, item) => sum + lineTotalCents(item.product.price, item.quantity),
    0,
  );
  const itemDiscountTotalCents = cart.reduce((sum, item) => {
    const maxDiscount = lineTotalCents(item.product.price, item.quantity);
    return sum + Math.min(item.discountCents, maxDiscount);
  }, 0);
  const payableBeforeOrderDiscountCents = Math.max(
    totalAmountCents - itemDiscountTotalCents,
    0,
  );
  const orderDiscountCents = Math.min(
    discountCents,
    payableBeforeOrderDiscountCents,
  );
  const itemDiscountTotal = itemDiscountTotalCents / 100;
  const totalAmount = totalAmountCents / 100 - itemDiscountTotal;
  const orderTotalCents = Math.max(
    totalAmountCents - itemDiscountTotalCents - orderDiscountCents,
    0,
  );
  const orderTotal = orderTotalCents / 100;
  const paymentTotal = payments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0,
  );
  const remaining = orderTotal - paymentTotal;
  const change = Math.max(amountReceivedCents / 100 - orderTotal, 0);

  const hasFiadoPayment = payments.some((p) => isFiadoMethod(p.method));
  const isDefaultCustomer = customer.id === defaultCustomer.id;
  const canSubmitOrder =
    cart.length > 0 &&
    payments.length > 0 &&
    Math.abs(remaining) < 0.001 &&
    !(hasFiadoPayment && isDefaultCustomer);

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
      amountPaidInputRef.current?.focus();
      amountPaidInputRef.current?.select();
    }, 0);

    return () => clearTimeout(timer);
  }, [showCheckoutDrawer]);

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

  useEffect(() => {
    if (highlightedIdx >= 0 && listRef.current) {
      listRef.current.children[highlightedIdx]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIdx]);

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
            if (c) selectCustomer({ id: c.id, name: c.name });
          } else if (customerResults.length > 0) {
            const firstCustomer = customerResults[0];
            selectCustomer({ id: firstCustomer.id, name: firstCustomer.name });
          }
          return;
        }
      }

      if (e.key === "Enter") {
        const handledScaleBarcode = await handleScaleBarcodeSubmit();
        if (handledScaleBarcode) {
          e.preventDefault();
          return;
        }
      }

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
          if (productToAdd) addToCart(productToAdd);
          return;
        }
      }

      if (e.ctrlKey && e.key === "3") {
        e.preventDefault();
        receiveButtonRef.current?.click();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "1") {
        e.preventDefault();
        if (showCustomerPicker) {
          customerSearchRef.current?.focus();
        } else {
          openCustomerPicker();
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === "4" && showCheckoutDrawer) {
        e.preventDefault();
        document.getElementById("payment-method-0")?.focus();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "5" && showCheckoutDrawer) {
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

  const discountAmount = formatBRL(orderDiscountCents / 100);
  const amountReceived = formatBRL(amountReceivedCents / 100);

  return (
    <>
      {/* Desktop */}
      <section className="hidden sm:grid grid-cols-[30%_70%] h-[calc(100vh-75px)] mt-4">
        <CartPanel
          cart={cart}
          totalItems={totalItems}
          totalAmount={totalAmount}
          itemDiscountTotal={itemDiscountTotal}
          onRemoveItem={removeItem}
          onUpdateQtyFromInput={updateQtyFromInput}
          onUpdateItemDiscountFromInput={updateItemDiscountFromInput}
          onUpdateQty={updateQty}
        />

        <div className="flex-1 flex flex-col ml-6">
          <CustomerPicker
            customer={customer}
            showCustomerPicker={showCustomerPicker}
            customerSearch={customerSearch}
            customerLoading={customerLoading}
            customerResults={customerResults}
            highlightedCustomerIdx={highlightedCustomerIdx}
            customerSearchRef={customerSearchRef}
            customerListRef={customerListRef}
            onToggle={() =>
              showCustomerPicker
                ? setShowCustomerPicker(false)
                : openCustomerPicker()
            }
            onClose={() => setShowCustomerPicker(false)}
            onSearchChange={handleCustomerSearchChange}
            onSelectCustomer={selectCustomer}
          />

          <ProductSearch
            searchRef={searchRef}
            listRef={listRef}
            search={search}
            loading={loading}
            results={results}
            showResults={showResults}
            highlightedIdx={highlightedIdx}
            scaleBarcodeFeedback={scaleBarcodeFeedback}
            onSearchChange={handleSearchChange}
            onFocusSearch={() => results.length > 0 && setShowResults(true)}
            onCloseResults={() => setShowResults(false)}
            onAddToCart={addToCart}
          />

          <div className="justify-end flex">
            <button
              id="btn-receber"
              ref={receiveButtonRef}
              disabled={cart.length === 0}
              onClick={openCheckoutDrawer}
              className="border w-fit p-2 bg-black text-white cursor-pointer uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            >
              receber [ctrl + 3]
            </button>
          </div>
        </div>

        <CheckoutDrawer
          showCheckoutDrawer={showCheckoutDrawer}
          orderTotal={orderTotal}
          orderAction={orderAction}
          amountPaidInputRef={amountPaidInputRef}
          discountAmount={discountAmount}
          payableBeforeOrderDiscountCents={payableBeforeOrderDiscountCents}
          isPaymentAmountManuallyEdited={isPaymentAmountManuallyEdited}
          setDiscountCents={setDiscountCents}
          setPayments={setPayments}
          amountReceived={amountReceived}
          setAmountReceivedCents={setAmountReceivedCents}
          change={change}
          customer={customer}
          cart={cart}
          payments={payments}
          today={getTodayDate()}
          isFiadoMethod={isFiadoMethod}
          getDueDate={getDueDate}
          paymentMethods={paymentMethods}
          setIsPaymentAmountManuallyEdited={setIsPaymentAmountManuallyEdited}
          remaining={remaining}
          orderState={orderState}
          finalizeButtonRef={finalizeButtonRef}
          canSubmitOrder={canSubmitOrder}
          pendingOrder={pendingOrder}
          onClose={() => setShowCheckoutDrawer(false)}
          orderDiscountCents={orderDiscountCents}
          standardCategory={standardCategory}
        />
      </section>

      {/* Mobile */}
      <section className="sm:hidden flex flex-col relative h-[calc(100vh-75px)] mt-4">
        <div className="flex justify-start">
          <BarcodeScannerButton
            onDetected={(code) => handleBarcodeValue(code, true)}
          />
        </div>

        <div className="mt-4 flex justify-center items-center gap-1">
          <ProductSearch
            searchRef={searchRef}
            listRef={listRef}
            search={search}
            loading={loading}
            results={results}
            showResults={showResults}
            highlightedIdx={highlightedIdx}
            scaleBarcodeFeedback={scaleBarcodeFeedback}
            onSearchChange={handleSearchChange}
            onFocusSearch={() => results.length > 0 && setShowResults(true)}
            onCloseResults={() => setShowResults(false)}
            onAddToCart={addToCart}
          />
        </div>

        <div className="h-100 mt-8">
          <CartPanel
            cart={cart}
            totalItems={totalItems}
            totalAmount={totalAmount}
            itemDiscountTotal={itemDiscountTotal}
            onRemoveItem={removeItem}
            onUpdateQtyFromInput={updateQtyFromInput}
            onUpdateItemDiscountFromInput={updateItemDiscountFromInput}
            onUpdateQty={updateQty}
          />
        </div>

        <div className="mt-6">
          <CustomerPicker
            customer={customer}
            showCustomerPicker={showCustomerPicker}
            customerSearch={customerSearch}
            customerLoading={customerLoading}
            customerResults={customerResults}
            highlightedCustomerIdx={highlightedCustomerIdx}
            customerSearchRef={customerSearchRef}
            customerListRef={customerListRef}
            onToggle={() =>
              showCustomerPicker
                ? setShowCustomerPicker(false)
                : openCustomerPicker()
            }
            onClose={() => setShowCustomerPicker(false)}
            onSearchChange={handleCustomerSearchChange}
            onSelectCustomer={selectCustomer}
          />
        </div>

        <div className="absolute bottom-5 w-full">
          <button
            id="btn-receber"
            ref={receiveButtonRef}
            disabled={cart.length === 0}
            onClick={openCheckoutDrawer}
            className="border w-full p-2 bg-black text-white cursor-pointer uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            receber
          </button>
        </div>

        <CheckoutDrawer
          showCheckoutDrawer={showCheckoutDrawer}
          orderTotal={orderTotal}
          orderAction={orderAction}
          amountPaidInputRef={amountPaidInputRef}
          discountAmount={discountAmount}
          payableBeforeOrderDiscountCents={payableBeforeOrderDiscountCents}
          isPaymentAmountManuallyEdited={isPaymentAmountManuallyEdited}
          setDiscountCents={setDiscountCents}
          setPayments={setPayments}
          amountReceived={amountReceived}
          setAmountReceivedCents={setAmountReceivedCents}
          change={change}
          customer={customer}
          cart={cart}
          payments={payments}
          today={getTodayDate()}
          isFiadoMethod={isFiadoMethod}
          getDueDate={getDueDate}
          paymentMethods={paymentMethods}
          setIsPaymentAmountManuallyEdited={setIsPaymentAmountManuallyEdited}
          remaining={remaining}
          orderState={orderState}
          finalizeButtonRef={finalizeButtonRef}
          canSubmitOrder={canSubmitOrder}
          pendingOrder={pendingOrder}
          onClose={() => setShowCheckoutDrawer(false)}
          orderDiscountCents={orderDiscountCents}
          standardCategory={standardCategory}
        />
      </section>
    </>
  );
}
