"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { baseInput, baseLabel, errorText, floatedLabel } from "./inputField";

type Option = { label: string; value: string };

type SearchableSelectProps = {
  label: string;
  name: string;
  options: Option[];
  error?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "value" | "onChange"
> & {
    defaultValue?: string;
  };

export function SearchableSelectInputField({
  label,
  name,
  options,
  error,
  defaultValue = "",
  required,
  ...props
}: SearchableSelectProps) {
  const initialOption =
    options.find((option) => option.value === defaultValue) ?? null;

  const [query, setQuery] = useState(initialOption?.label ?? "");
  const [selectedValue, setSelectedValue] = useState(initialOption?.value ?? "");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedValue(option.value);
    setQuery(option.label);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative mt-6">
      <input type="hidden" name={name} value={selectedValue} required={required} />
      <input
        {...props}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedValue("");
          setOpen(true);
        }}
        autoComplete="off"
        className={`${baseInput} pr-6 ${error ? "border-red-500 focus:border-red-500" : ""}`}
      />

      <label
        className={`${baseLabel} ${floatedLabel}
          peer-[[value='']]:top-2 peer-[[value='']]:text-sm
          peer-[&:not([value=''])]:-top-3.5 peer-[&:not([value=''])]:text-[12px]
          ${error ? "text-red-500" : ""}`}
      >
        {label}
      </label>

      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
        <Search strokeWidth={0.8} size={16} />
      </span>

      {open && filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 border bg-white z-20 max-h-52 overflow-y-auto shadow-md scrollbar-hidden">
          {filteredOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && filteredOptions.length === 0 && (
        <p className="absolute left-0 right-0 top-full mt-1 border bg-white z-20 px-3 py-2 text-xs text-tertiary">
          nenhum contato encontrado
        </p>
      )}

      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
