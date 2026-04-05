"use client";

import { useState, useEffect } from "react";
import { FinanceCategory } from "@/lib/api/finance-category";
import { Plus, X } from "lucide-react";
import Link from "next/link";

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
  const [search] = useState("");

  const selected = categories.find((c) => String(c.id) === value);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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
            className="relative pointer-events-auto w-full sm:w-[55%] bg-background rounded-t-4xl sm:rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col"
            style={{ height: "92dvh", maxHeight: "92dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-5 h-7 rounded-full bg-tertiary/10 hover:bg-tertiary/20 transition-colors cursor-pointer"
              >
                <X size={16} className="text-tertiary" />
              </button>
            </div>

            <div className="px-4 pt-4 pb-2">
              <p className="text-6xl">categorias</p>
            </div>

            {/* List */}
            <ul className="overflow-y-auto flex-1 px-2 pb-6">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-tertiary/60 text-start">
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

            <div className="absolute bottom-2 right-0 px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
              <Link
                href={"/financeiro/categorias"}
                className="flex items-center justify-center w-5 h-7 rounded-full bg-tertiary/10 hover:bg-tertiary/20 transition-colors cursor-pointer"
              >
                <Plus size={16} className="text-tertiary" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
