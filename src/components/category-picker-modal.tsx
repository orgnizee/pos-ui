"use client";
import { useState, useEffect } from "react";
import { FinanceCategory } from "@/lib/api/financeCategory";
import { Plus, X } from "lucide-react";
import Link from "next/link";

interface CategoryPickerModalProps {
  categories: FinanceCategory[];
  value: string;
  onChange: (id: string) => void;
}

const GROUP_NAMES = ["receitas", "despesas"];

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

  // Find the parent categories for "receitas" and "despesas"
  const parents = categories.filter((c) =>
    GROUP_NAMES.includes(c.name.toLowerCase()),
  );

  // Get children for a given parent id
  const childrenOf = (parentId: number | string) =>
    filtered.filter(
      (c) => c.parent !== null && String(c.parent.id) === String(parentId),
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
        className={`w-full h-full p-2 flex items-center cursor-pointer outline-none normal-case focus:border focus:border-tertiary focus:rounded-md text-sm font-light ${
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

      {/* Modal */}
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

            <div className="px-4 pt-4 pb-2 shrink-0">
              <p className="text-6xl">categorias</p>
            </div>

            {/* Grouped list */}
            <div className="overflow-y-auto mt-4 flex-1 px-4 pb-6 flex flex-col gap-4 rounded-md">
              {parents.map((parent) => {
                const children = childrenOf(parent.id);
                return (
                  <div
                    key={parent.id}
                    className="rounded-md bg-secondary/10 overflow-hidden"
                  >
                    {/* Group title */}
                    <p className="px-4 pt-3 pb-1 text-lg font-medium text-tertiary uppercase tracking-wide">
                      {parent.name.toLocaleLowerCase()}
                    </p>

                    {/* Children */}
                    <ul className="px-2 pb-2">
                      {children.length === 0 && (
                        <li className="px-2 py-2 text-sm text-tertiary/60">
                          nenhuma categoria encontrada
                        </li>
                      )}
                      {children.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onChange(String(c.id));
                              setOpen(false);
                            }}
                            className={`w-full text-left px-2 py-2.5 rounded-lg text-sm font-light transition-colors hover:bg-tertiary/10 cursor-pointer ${
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
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-2 right-0 px-4 pt-4 pb-2">
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
