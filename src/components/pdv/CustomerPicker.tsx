"use client";

import { ChevronDown, Search } from "lucide-react";
import { Customer } from "@/lib/api/customers";
import { formatCPF } from "@/lib/utils/format";
import { CustomerOption } from "./types";

type Props = {
  customer: CustomerOption;
  showCustomerPicker: boolean;
  customerSearch: string;
  customerLoading: boolean;
  customerResults: Customer[];
  highlightedCustomerIdx: number;
  customerSearchRef: React.RefObject<HTMLInputElement | null>;
  customerListRef: React.RefObject<HTMLUListElement | null>;
  onToggle: () => void;
  onClose: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectCustomer: (c: CustomerOption) => void;
};

export function CustomerPicker({
  customer,
  showCustomerPicker,
  customerSearch,
  customerLoading,
  customerResults,
  highlightedCustomerIdx,
  customerSearchRef,
  customerListRef,
  onToggle,
  onClose,
  onSearchChange,
  onSelectCustomer,
}: Props) {
  return (
    <div className="justify-end flex relative">
      <button
        onClick={onToggle}
        className="border w-fit p-2 flex items-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className={customer.id ? "" : "text-tertiary"}>{customer.name.toUpperCase()}</span>
        <ChevronDown size={14} strokeWidth={1} />
      </button>

      {showCustomerPicker && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute top-full right-0 mt-1 border bg-white z-20 w-72 shadow-md">
            <div className="flex items-center gap-2 border-b px-2">
              <Search size={14} strokeWidth={1} className="text-tertiary shrink-0" />
              <input
                ref={customerSearchRef}
                type="text"
                value={customerSearch}
                onChange={onSearchChange}
                placeholder="BUSCAR CLIENTE"
                className="w-full py-2 bg-transparent outline-none text-sm placeholder:text-tertiary"
                autoComplete="off"
              />
              {customerLoading && (
                <span className="text-tertiary text-xs shrink-0 animate-pulse">...</span>
              )}
            </div>
            <ul ref={customerListRef} className="max-h-60 overflow-y-auto">
              {customerResults.map((c, idx) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCustomer({ id: c.id, name: c.name })}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                      highlightedCustomerIdx === idx + 1 ? "bg-gray-100" : ""
                    } ${customer.id === c.id ? "font-medium" : ""}`}
                  >
                    <span className="block uppercase">{c.name}</span>
                    {c.cpf && <span className="text-xs text-tertiary">{formatCPF(c.cpf)}</span>}
                  </button>
                </li>
              ))}
              {!customerLoading && customerResults.length === 0 && customerSearch.trim() && (
                <li className="px-3 py-2 text-sm text-tertiary">nenhum cliente encontrado</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
