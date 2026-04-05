"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ count }: { count: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? 1);
  const totalPages = Math.ceil(count / 50);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/caixa?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-7 h-7 rounded-md bg-secondary/20 disabled:opacity-30"
      >
        <ChevronLeft size={14} />
      </button>

      <p className="text-sm normal-case">
        {currentPage} / {totalPages}
      </p>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-7 h-7 rounded-md bg-secondary/20 disabled:opacity-30"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
