"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { FinanceCategory } from "@/lib/api/finance-category";

interface CategoryPickerModalProps {
  categories: FinanceCategory[];
  value: string;
  onChange: (id: string) => void;
}

export default function CategoryPickerModal({
  categories,
  value,
  onChange,
}: CategoryPickerModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = categories.find((c) => String(c.id) === value);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* Trigger field */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        className={`w-full h-full p-2 flex items-center cursor-pointer outline-none focus:border focus:border-tertiary focus:rounded-md text-sm font-light ${
          !selected ? "text-tertiary/75" : "text-black"
        }`}
      >
        {selected ? selected.name.toLocaleLowerCase() : "categoria"}
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Modal — slides up from bottom on mobile, centered on sm+ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full sm:w-[55%] bg-background rounded-t-4xl sm:rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col"
            style={{ height: "92dvh", maxHeight: "92dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-5 h-7 rounded-full bg-tertiary/10 hover:bg-tertiary/20 transition-colors cursor-pointer"
              >
                <X size={16} className="text-tertiary" />
              </button>
            </div>

            <div className="px-4 pt-4 pb-2">
              <p className="text-6xl">categoria</p>
            </div>

            {/* Search */}
            <div className="flex items-center w-full gap-2 px-4 pb-2 shrink-0">
              <div className="relative w-full">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-tertiary/50 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-7 pr-2 text-sm font-light rounded-md bg-secondary/10 outline-none focus:border-tertiary placeholder:text-tertiary/50"
                />
              </div>
            </div>

            {/* List */}
            <ul className="overflow-y-auto flex-1 px-2 pb-6">
              {filtered.length === 0 && (
                <li className="px-2 py-3 text-sm text-tertiary/60 text-center">
                  nenhuma categoria encontrada
                </li>
              )}
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(String(c.id));
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-light transition-colors hover:bg-tertiary/10 ${
                      String(c.id) === value
                        ? "font-medium text-black"
                        : "text-black"
                    }`}
                  >
                    {c.name.toLocaleLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
