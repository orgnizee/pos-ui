"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.length >= 3) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/${endpoint}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="flex items-center gap-2 w-full sm:w-100 h-8.5 border-b border-secondary">
      <input
        ref={inputRef}
        type="text"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="PESQUISAR"
        className="flex-1 text-end bg-transparent text-sm outline-none uppercase placeholder:text-tertiary"
      />
    </div>
  );
}
