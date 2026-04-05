"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.length > 3) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/caixa?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center gap-2 w-80 h-7 px-3 rounded-full bg-secondary/25">
      <Search strokeWidth={1} size={14} className="shrink-0 text-tertiary" />
      <input
        type="text"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="pesquisar"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-tertiary normal-case"
      />
    </div>
  );
}
